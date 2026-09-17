// @ts-nocheck
import { Mail as MailIcon, Phone as PhoneIcon, Link as LinkIcon, GitBranch as GitBranchIcon, MapPin as MapPinIcon, Code2 } from 'lucide-react';
import './CVTemplates.css';

export interface LegacyCvData {
  name: string; title: string; workPreference: string; bio: string; email: string; phone: string;
  linkedin: string; github: string; portfolio: string; location: string;
  skills: Array<{ id: string; category: string; items: string[] }>;
  experience: Array<{ id: string; role: string; company: string; start: string; end: string; workType: string; bullets: string[] }>;
  projects: Array<{ id: string; title: string; role: string; bullets: string[] }>;
  education: Array<{ id: string; degree: string; school: string; year: string }>;
}

function Section({ title, children, className = '' }) {
  return (
      <section className={`cv-section ${className}`}>
        <h2>{title}</h2>
        {children}
      </section>
  );
}

function ContactLine({ data, centered = false }) {
  const items = [];

  if (data.phone) {
    items.push(
        <span key="phone">
        <PhoneIcon size={11} />
          {data.phone}
      </span>
    );
  }

  if (data.email) {
    items.push(
        <span key="email">
        <MailIcon size={11} />
          {data.email}
      </span>
    );
  }

  if (data.linkedin) {
    items.push(
        <span key="linkedin">
        <LinkIcon size={11} />
        LinkedIn
      </span>
    );
  }

  if (data.github) {
    items.push(
        <span key="github">
        <GitBranchIcon size={11} />
        GitHub
      </span>
    );
  }

  if (data.portfolio) {
    items.push(
        <span key="portfolio">
        <LinkIcon size={11} />
        Portfolio
      </span>
    );
  }

  return (
      <div
          className="cv-contact"
          style={{
            justifyContent: centered ? 'center' : 'flex-start',
          }}
      >
        {items}
      </div>
  );
}

function LocationLine({ data, centered = false }) {
  if (!data.location && !data.workPreference) return null;

  return (
      <div
          className="cv-location"
          style={{
            justifyContent: centered ? 'center' : 'flex-start',
          }}
      >
        {data.location && (
            <span>
          <MapPinIcon size={12} />
              {data.location}
        </span>
        )}

        {data.location && data.workPreference && (
            <span className="separator">—</span>
        )}

        {data.workPreference && <span>{data.workPreference}</span>}
      </div>
  );
}

function Summary({ data }) {
  if (!data.bio) return null;

  return (
      <Section title="Professional Summary">
        <p className="cv-summary">{data.bio}</p>
      </Section>
  );
}

function SkillsList({ data, title = 'Technical Skills' }) {
  const groups = data.skills.filter((group) => group.items.length > 0);

  if (!groups.length) return null;

  return (
      <Section title={title}>
        <div className="skills-list">
          {groups.map((group) => (
              <div key={group.id} className="skill-row">
                <strong>{group.category}:</strong>
                <span>{group.items.join(', ')}</span>
              </div>
          ))}
        </div>
      </Section>
  );
}

function SkillsGrid({ data, title = 'Core Expertise' }) {
  const groups = data.skills.filter((group) => group.items.length > 0);

  if (!groups.length) return null;

  return (
      <Section title={title}>
        <div className="skills-grid">
          {groups.map((group) => (
              <div key={group.id} className="skills-grid-card">
                <strong>{group.category}</strong>
                <span>{group.items.join(', ')}</span>
              </div>
          ))}
        </div>
      </Section>
  );
}

function ExperienceList({
                            data,
                            timeline = false,
                            title = 'Experience',
                        }) {
    if (!data.experience.length) return null;

    return (
        <Section title={title}>
            <div className={timeline ? 'timeline-list' : 'experience-list'}>
                {data.experience.map((exp) => (
                    <article
                        key={exp.id}
                        className={timeline ? 'timeline-item' : 'experience-item'}
                    >
                        <div className="experience-heading">
                            <div>
                                <h3>{exp.role || 'Job Title'}</h3>

                                <div className="experience-company">
                                    {exp.company || 'Company'}
                                    {exp.workType ? ` · ${exp.workType}` : ''}
                                </div>
                            </div>

                            <div className="experience-date">
                                {exp.start}
                                {exp.start && exp.end ? ' — ' : ''}
                                {exp.end}
                            </div>
                        </div>

                        {exp.bullets.length > 0 && (
                            <ul>
                                {exp.bullets.map((bullet, index) => (
                                    <li key={index}>{bullet}</li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </div>
        </Section>
    );
}

function ProjectsList({ data, title = 'Selected Projects' }) {
  if (!data.projects.length) return null;

  return (
      <Section title={title}>
        <div className="projects-list">
          {data.projects.map((project) => (
              <article key={project.id} className="project-item">
                <h3>
                  {project.title || 'Project Name'}
                  {project.role && (
                      <span className="project-role"> — {project.role}</span>
                  )}
                </h3>

                {project.bullets.length > 0 && (
                    <ul>
                      {project.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                )}
              </article>
          ))}
        </div>
      </Section>
  );
}

function EducationList({ data }) {
  if (!data.education.length) return null;

  return (
      <Section title="Education">
        <div className="education-list">
          {data.education.map((edu) => (
              <div key={edu.id} className="education-item">
                <strong>{edu.degree || 'Degree'}</strong>
                <span>
              {edu.school}
                  {edu.school && edu.year ? ' · ' : ''}
                  {edu.year}
            </span>
              </div>
          ))}
        </div>
      </Section>
  );
}

function CenteredHeader({ data, className = '' }) {
  return (
      <header className={`centered-header ${className}`}>
        <h1>{data.name || 'YOUR NAME'}</h1>

        <div className="cv-title">
          {data.title || 'Professional Title'}
        </div>

        <LocationLine data={data} centered />
        <ContactLine data={data} centered />
      </header>
  );
}

function LeftHeader({ data, className = '' }) {
  return (
      <header className={`left-header ${className}`}>
        <h1>{data.name || 'YOUR NAME'}</h1>
        <div className="cv-title">
          {data.title || 'Professional Title'}
        </div>
        <LocationLine data={data} />
        <ContactLine data={data} />
      </header>
  );
}

/* ============================================================
   TEMPLATE 1–5: ATS / PROFESSIONAL
============================================================ */

function Template1({ data }) {
  return (
      <div className="cv-document template template-1">
        <CenteredHeader data={data} />
        <Summary data={data} />
        <SkillsList data={data} />
        <ExperienceList data={data} />
        <ProjectsList data={data} title="Selected Projects & Product Ownership" />
        <EducationList data={data} />
      </div>
  );
}

function Template2({ data }) {
  return (
      <div className="cv-document template template-2">
        <LeftHeader data={data} />
        <Summary data={data} />
        <ExperienceList data={data} />
        <SkillsList data={data} title="Core Skills" />
        <ProjectsList data={data} />
        <EducationList data={data} />
      </div>
  );
}

function Template3({ data }) {
  return (
      <div className="cv-document template template-3">
        <header className="corporate-header">
          <div>
            <h1>{data.name || 'YOUR NAME'}</h1>
            <div className="cv-title">{data.title || 'Professional Title'}</div>
          </div>

          <div className="corporate-contact">
            <LocationLine data={data} />
            <ContactLine data={data} />
          </div>
        </header>

        <Summary data={data} />
        <SkillsGrid data={data} title="Core Competencies" />
        <ExperienceList data={data} />
        <ProjectsList data={data} title="Professional Projects" />
        <EducationList data={data} />
      </div>
  );
}

function Template4({ data }) {
  return (
      <div className="cv-document template template-4">
        <CenteredHeader data={data} />

        <div className="traditional-body">
          <Summary data={data} />
          <ExperienceList data={data} />
          <ProjectsList data={data} />
          <EducationList data={data} />
          <SkillsList data={data} />
        </div>
      </div>
  );
}

function Template5({ data }) {
  return (
      <div className="cv-document template template-5">
        <LeftHeader data={data} />

        <Summary data={data} />

        <div className="compact-top-grid">
          <div>
            <ExperienceList data={data} />
          </div>

          <aside>
            <SkillsList data={data} title="Skills" />
            <EducationList data={data} />
          </aside>
        </div>

        <ProjectsList data={data} />
      </div>
  );
}

/* ============================================================
   TEMPLATE 6–10: MODERN / EXECUTIVE
============================================================ */

function Template6({ data }) {
  return (
      <div className="cv-document template template-6">
        <header className="modern-executive-header">
          <div>
            <div className="template-kicker">PROFESSIONAL PROFILE</div>
            <h1>{data.name || 'YOUR NAME'}</h1>
            <div className="cv-title">
              {data.title || 'Professional Title'}
            </div>
          </div>

          <div className="modern-contact">
            <LocationLine data={data} />
            <ContactLine data={data} />
          </div>
        </header>

        <div className="executive-grid">
          <main>
            <Summary data={data} />
            <ExperienceList data={data} />
            <ProjectsList data={data} />
          </main>

          <aside>
            <SkillsGrid data={data} title="Key Skills" />
            <EducationList data={data} />
          </aside>
        </div>
      </div>
  );
}

function Template7({ data }) {
  return (
      <div className="cv-document template template-7">
        <div className="sidebar-layout">
          <aside className="executive-sidebar">
            <h1>{data.name || 'YOUR NAME'}</h1>
            <div className="sidebar-title">
              {data.title || 'Professional Title'}
            </div>

            <LocationLine data={data} />
            <ContactLine data={data} />
            <SkillsGrid data={data} title="Expertise" />
            <EducationList data={data} />
          </aside>

          <main className="sidebar-main">
            <Summary data={data} />
            <ExperienceList data={data} />
            <ProjectsList data={data} />
          </main>
        </div>
      </div>
  );
}

function Template8({ data }) {
  return (
      <div className="cv-document template template-8">
        <CenteredHeader data={data} />
        <Summary data={data} />
        <ExperienceList data={data} timeline />
        <div className="modern-bottom-grid">
          <ProjectsList data={data} />
          <div>
            <SkillsGrid data={data} title="Core Expertise" />
            <EducationList data={data} />
          </div>
        </div>
      </div>
  );
}

function Template9({ data }) {
  const skillGroups = data.skills
      .filter((group) => group.items.length)
      .slice(0, 6);

  return (
      <div className="cv-document template template-9">
        <header className="leadership-header">
          <div className="template-kicker">EXECUTIVE PROFILE</div>
          <h1>{data.name || 'YOUR NAME'}</h1>
          <div className="cv-title">
            {data.title || 'Professional Title'}
          </div>
          <ContactLine data={data} centered />
        </header>

        {data.bio && (
            <section className="leadership-summary">
              <p>{data.bio}</p>
            </section>
        )}

        {skillGroups.length > 0 && (
            <section className="leadership-expertise">
              <h2>Leadership & Core Expertise</h2>

              <div>
                {skillGroups.map((group) => (
                    <span key={group.id}>{group.category}</span>
                ))}
              </div>
            </section>
        )}

        <ExperienceList data={data} />
        <ProjectsList data={data} title="Selected Achievements & Initiatives" />
        <EducationList data={data} />
      </div>
  );
}

function Template10({ data }) {
  return (
      <div className="cv-document template template-10">
        <header className="slate-header">
          <div>
            <h1>{data.name || 'YOUR NAME'}</h1>
            <div className="cv-title">
              {data.title || 'Professional Title'}
            </div>
          </div>

          <div>
            <LocationLine data={data} />
            <ContactLine data={data} />
          </div>
        </header>

        <div className="slate-intro-grid">
          <Summary data={data} />
          <SkillsGrid data={data} title="Core Expertise" />
        </div>

        <ExperienceList data={data} />
        <ProjectsList data={data} />
        <EducationList data={data} />
      </div>
  );
}

/* ============================================================
   TEMPLATE 11–15: TECHNICAL / SOFTWARE ENGINEER
============================================================ */

function Template11({ data }) {
  return (
      <div className="cv-document template template-11">
        <header className="engineer-header">
          <h1>{data.name || 'YOUR NAME'}</h1>
          <div className="engineer-role">
            {data.title || 'SOFTWARE ENGINEER'}
          </div>
          <LocationLine data={data} centered />
          <ContactLine data={data} centered />
        </header>

        <Summary data={data} />
        <SkillsList data={data} title="Technical Skills" />
        <ExperienceList data={data} />
        <ProjectsList data={data} title="Engineering Projects" />
        <EducationList data={data} />
      </div>
  );
}

function Template12({ data }) {
  const groups = data.skills.filter((group) => group.items.length);

  return (
      <div className="cv-document template template-12">
        <LeftHeader data={data} />
        <Summary data={data} />

        {groups.length > 0 && (
            <Section title="Technology Stack">
              <div className="tech-stack-table">
                {groups.map((group) => (
                    <div key={group.id}>
                      <strong>{group.category}</strong>
                      <span>{group.items.join(', ')}</span>
                    </div>
                ))}
              </div>
            </Section>
        )}

        <ExperienceList data={data} />
        <ProjectsList data={data} title="Systems & Projects" />
        <EducationList data={data} />
      </div>
  );
}

function Template13({ data }) {
  const specializations = data.skills
      .filter((group) => group.items.length)
      .slice(0, 6);

  return (
      <div className="cv-document template template-13">
        <header className="engineering-profile-header">
          <div className="engineering-label">ENGINEERING PROFILE</div>
          <h1>{data.name || 'YOUR NAME'}</h1>
          <div className="cv-title">
            {data.title || 'Professional Title'}
          </div>
          <ContactLine data={data} centered />
        </header>

        {data.bio && (
            <section className="engineering-about">
              <h2>About</h2>
              <p>{data.bio}</p>
            </section>
        )}

        {specializations.length > 0 && (
            <section className="specialization-section">
              <h2>Specializations</h2>
              <div className="specialization-grid">
                {specializations.map((group) => (
                    <div key={group.id}>
                      <Code2 size={16} />
                      <strong>{group.category}</strong>
                      <span>{group.items.join(', ')}</span>
                    </div>
                ))}
              </div>
            </section>
        )}

        <ExperienceList data={data} />
        <ProjectsList data={data} title="Systems & Engineering Projects" />
        <EducationList data={data} />
      </div>
  );
}

function Template14({ data }) {
  return (
      <div className="cv-document template template-14">
        <header className="developer-compact-header">
          <div>
            <h1>{data.name || 'YOUR NAME'}</h1>
            <div className="cv-title">
              {data.title || 'Software Engineer'}
            </div>
          </div>

          <ContactLine data={data} />
        </header>

        <div className="developer-compact-grid">
          <aside>
            <Summary data={data} />
            <SkillsGrid data={data} title="Tech Stack" />
          </aside>

          <main>
            <ExperienceList data={data} />
            <ProjectsList data={data} />
            <EducationList data={data} />
          </main>
        </div>
      </div>
  );
}

function Template15({ data }) {
  return (
      <div className="cv-document template template-15">
        <header className="technical-dark-header">
          <div className="technical-dark-tag">
            SOFTWARE ENGINEERING PROFILE
          </div>

          <h1>{data.name || 'YOUR NAME'}</h1>

          <div className="cv-title">
            {data.title || 'Professional Title'}
          </div>

          <ContactLine data={data} centered />
        </header>

        <Summary data={data} />
        <SkillsGrid data={data} title="Technical Stack" />
        <ExperienceList data={data} />
        <ProjectsList data={data} title="Featured Systems & Projects" />
        <EducationList data={data} />
      </div>
  );
}

/* ============================================================
   TEMPLATE 16–20: PREMIUM / CREATIVE / COMPACT
============================================================ */

function Template16({ data }) {
  return (
      <div className="cv-document template template-16">
        <header className="premium-header">
          <div className="premium-line" />
          <h1>{data.name || 'YOUR NAME'}</h1>
          <div className="cv-title">
            {data.title || 'Professional Title'}
          </div>
          <LocationLine data={data} centered />
          <ContactLine data={data} centered />
          <div className="premium-line" />
        </header>

        {data.bio && (
            <section className="premium-profile-statement">
              <p>{data.bio}</p>
            </section>
        )}

        <ExperienceList data={data} />
        <SkillsGrid data={data} title="Key Expertise" />
        <ProjectsList data={data} title="Selected Work" />
        <EducationList data={data} />
      </div>
  );
}

function Template17({ data }) {
  return (
      <div className="cv-document template template-17">
        <div className="creative-split">
          <aside className="creative-side">
            <h1>{data.name || 'YOUR NAME'}</h1>
            <div className="creative-role">
              {data.title || 'Professional Title'}
            </div>

            <ContactLine data={data} />
            <LocationLine data={data} />

            <SkillsGrid data={data} title="Skills" />
            <EducationList data={data} />
          </aside>

          <main className="creative-main">
            <Summary data={data} />
            <ExperienceList data={data} />
            <ProjectsList data={data} title="Selected Projects" />
          </main>
        </div>
      </div>
  );
}

function Template18({ data }) {
  return (
      <div className="cv-document template template-18">
        <CenteredHeader data={data} />

        <div className="premium-compact-top">
          <Summary data={data} />
          <SkillsGrid data={data} title="Skills" />
        </div>

        <ExperienceList data={data} />

        <div className="premium-compact-bottom">
          <ProjectsList data={data} />
          <EducationList data={data} />
        </div>
      </div>
  );
}

function Template19({ data }) {
  return (
      <div className="cv-document template template-19">
        <header className="bold-portfolio-header">
          <div className="bold-number">01</div>

          <div>
            <h1>{data.name || 'YOUR NAME'}</h1>
            <div className="cv-title">
              {data.title || 'Professional Title'}
            </div>
            <ContactLine data={data} />
          </div>
        </header>

        <Summary data={data} />
        <ExperienceList data={data} title="Featured Experience" />
        <ProjectsList data={data} title="Selected Work" />
        <SkillsGrid data={data} title="Technologies & Expertise" />
        <EducationList data={data} />
      </div>
  );
}

function Template20({ data }) {
  return (
      <div className="cv-document template template-20">
        <header className="signature-header">
          <div className="signature-top">CURRICULUM VITAE</div>

          <h1>{data.name || 'YOUR NAME'}</h1>

          <div className="cv-title">
            {data.title || 'Professional Title'}
          </div>

          <div className="signature-rule" />

          <ContactLine data={data} centered />
        </header>

        <div className="signature-layout">
          <main>
            <Summary data={data} />
            <ExperienceList data={data} />
            <ProjectsList data={data} title="Selected Work" />
          </main>

          <aside>
            <SkillsGrid data={data} title="Expertise" />
            <EducationList data={data} />
          </aside>
        </div>
      </div>
  );
}


export function CVPreview({ data, template }: { data: LegacyCvData; template: string }) {
  switch (template) {
    case 'template-1': return <Template1 data={data} />;
    case 'template-2': return <Template2 data={data} />;
    case 'template-3': return <Template3 data={data} />;
    case 'template-4': return <Template4 data={data} />;
    case 'template-5': return <Template5 data={data} />;
    case 'template-6': return <Template6 data={data} />;
    case 'template-7': return <Template7 data={data} />;
    case 'template-8': return <Template8 data={data} />;
    case 'template-9': return <Template9 data={data} />;
    case 'template-10': return <Template10 data={data} />;
    case 'template-11': return <Template11 data={data} />;
    case 'template-12': return <Template12 data={data} />;
    case 'template-13': return <Template13 data={data} />;
    case 'template-14': return <Template14 data={data} />;
    case 'template-15': return <Template15 data={data} />;
    case 'template-16': return <Template16 data={data} />;
    case 'template-17': return <Template17 data={data} />;
    case 'template-18': return <Template18 data={data} />;
    case 'template-19': return <Template19 data={data} />;
    case 'template-20': return <Template20 data={data} />;
    default: return <Template1 data={data} />;
  }
}
