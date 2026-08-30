import html
import json
import os
import smtplib
import sys
from email.message import EmailMessage
from pathlib import Path


def safe(value, fallback='No indicado'):
    return html.escape(str(value if value not in (None, '') else fallback))


def story_html(story):
    keyword = story.get('palabra_clave') or {}
    keyword_term = keyword.get('palabra') or keyword.get('termino')
    keyword_daily = keyword.get('ejemplo_cotidiano') or keyword.get('uso_cotidiano')
    keyword_example = keyword.get('ejemplo_cuento') or keyword.get('ejemplo')
    pages = ''.join(
        f'<h3>Página {index}</h3><p>{safe(page)}</p>'
        for index, page in enumerate(story.get('paginas', []), 1)
    )
    questions = []
    for index, question in enumerate(story.get('preguntas', []), 1):
        options = question.get('opciones', [])
        answer_index = question.get('correcta')
        answer = options[answer_index] if isinstance(answer_index, int) and 0 <= answer_index < len(options) else 'No indicada'
        questions.append(
            f'<li><strong>{safe(question.get("enunciado"))}</strong>'
            f'<br>Respuesta esperada: {safe(answer)}</li>'
        )

    return f'''
      <section style="margin:0 0 32px">
        <h1 style="color:#087c70">{safe(story.get('titulo'))}</h1>
        <p><strong>Serie:</strong> {safe(story.get('serie'))} · Episodio {safe(story.get('episodio'))}</p>
        <p><strong>Edad:</strong> {safe(story.get('edad_min'))}–{safe(story.get('edad_max'))} años<br>
        <strong>Género:</strong> {safe(story.get('genero'))}<br>
        <strong>Valor:</strong> {safe(story.get('valor'))}</p>
        <h2>Resumen</h2>
        <p>{safe(story.get('sinopsis'))}</p>
        <h2>Palabra clave: {safe(keyword_term)}</h2>
        <p><strong>Significado:</strong> {safe(keyword.get('definicion'))}<br>
        <strong>Uso diario:</strong> {safe(keyword_daily)}<br>
        <strong>Ejemplo:</strong> {safe(keyword_example)}</p>
        <hr>{pages}
        <h2>Preguntas de comprensión</h2>
        <ol>{''.join(questions)}</ol>
      </section>
    '''


def main():
    user = os.environ.get('STORY_EMAIL_USER', '').strip()
    password = os.environ.get('STORY_EMAIL_APP_PASSWORD', '').strip()
    recipient = os.environ.get('STORY_EMAIL_TO', '').strip()
    if not user or not password or not recipient:
        raise SystemExit('Faltan los secretos STORY_EMAIL_USER o STORY_EMAIL_APP_PASSWORD.')

    list_path = Path(sys.argv[1])
    paths = [Path(line.strip()) for line in list_path.read_text(encoding='utf-8').splitlines() if line.strip()]
    stories = [json.loads(path.read_text(encoding='utf-8')) for path in paths]
    if not stories:
        return

    titles = ', '.join(story.get('titulo', 'Cuento sin título') for story in stories)
    pr_url = os.environ.get('PR_URL', '')
    pr_number = os.environ.get('PR_NUMBER', '')
    body = ''.join(story_html(story) for story in stories)

    message = EmailMessage()
    message['Subject'] = f'Tinkie: cuento para revisar — {titles}'
    message['From'] = user
    message['To'] = recipient
    message.set_content(f'Hay un cuento de Tinkie pendiente de revisión: {titles}\n\nPull Request #{pr_number}: {pr_url}')
    message.add_alternative(f'''
      <html><body style="font-family:Arial,sans-serif;color:#173f3c;line-height:1.55;max-width:720px;margin:auto">
        <p style="background:#e1f8ef;padding:16px;border-radius:12px">
          <strong>Nuevo contenido pendiente de tu aprobación.</strong><br>
          Nada se publicará hasta que aceptes el Pull Request.
        </p>
        {body}
        <p><a href="{html.escape(pr_url)}" style="display:inline-block;background:#087c70;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Revisar Pull Request #{safe(pr_number)}</a></p>
      </body></html>
    ''', subtype='html')

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=30) as smtp:
        smtp.login(user, password)
        smtp.send_message(message)


if __name__ == '__main__':
    main()
