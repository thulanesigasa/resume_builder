import os
import re

dir_path = r'D:\deployment_2026\resume_builder\templates\ats_resumes'
for file_name in os.listdir(dir_path):
    if not file_name.endswith('.html') or file_name == 'ats_resume_template.html':
        continue
    file_path = os.path.join(dir_path, file_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    replacement = '''{% if skills or technical_skills or soft_skills %}
      <div class="section">
          <div class="section-header">Key Skills</div>
          <div style="display: table; width: 100%;">
              <div style="display: table-cell; width: 50%; vertical-align: top; padding-right: 10px;">
                  {% if technical_skills %}
                  <h3 style="font-size: 10pt; margin: 0 0 5px 0;">Technical</h3>
                  <ul>
                      {% for skill in technical_skills %}
                      <li style="page-break-inside: avoid; margin-bottom: 4px;">{{ skill }}</li>
                      {% endfor %}
                  </ul>
                  {% elif skills %}
                  <ul>
                      {% set half = (skills|length / 2)|round(0, 'ceil')|int %}
                      {% for skill in skills[:half] %}
                      <li style="page-break-inside: avoid; margin-bottom: 4px;">{{ skill }}</li>
                      {% endfor %}
                  </ul>
                  {% endif %}
              </div>
              <div style="display: table-cell; width: 50%; vertical-align: top;">
                  {% if soft_skills %}
                  <h3 style="font-size: 10pt; margin: 0 0 5px 0;">Soft Skills</h3>
                  <ul>
                      {% for skill in soft_skills %}
                      <li style="page-break-inside: avoid; margin-bottom: 4px;">{{ skill }}</li>
                      {% endfor %}
                  </ul>
                  {% elif skills %}
                  <ul>
                      {% set half = (skills|length / 2)|round(0, 'ceil')|int %}
                      {% for skill in skills[half:] %}
                      <li style="page-break-inside: avoid; margin-bottom: 4px;">{{ skill }}</li>
                      {% endfor %}
                  </ul>
                  {% endif %}
              </div>
          </div>
      </div>
      {% endif %}'''

    # Need a flexible regex because spacing and tags slightly vary
    pattern = re.compile(r'{%\s*if skills or technical_skills\s*%}.*?{%\s*endif\s*%}', re.DOTALL)
    
    new_content = pattern.sub(replacement, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_name}")
