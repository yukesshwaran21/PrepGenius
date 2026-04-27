const ATS_TEMPLATES = [
  {
    id: 'ats-classic-chronological',
    name: 'ATS Classic Chronological',
    bestFor: 'Experienced candidates with linear career growth',
    expectedAtsScoreRange: '88-96',
    whyItScoresWell: [
      'Single-column linear structure with standard headings',
      'No tables, text boxes, or graphics',
      'Chronological experience makes date parsing reliable'
    ],
    headings: ['Summary', 'Skills', 'Experience', 'Education', 'Certifications'],
    templateText: `FULL NAME\nCity, State | phone@example.com | +1 555-555-5555 | linkedin.com/in/yourname\n\nSUMMARY\nResults-driven [Role] with [X] years of experience in [domain]. Skilled in [skill1], [skill2], and [skill3]. Proven record of [impact].\n\nSKILLS\nLanguages: [JavaScript, Python, SQL]\nFrameworks: [React, Node.js, Django]\nTools: [Git, Docker, AWS]\n\nEXPERIENCE\n[Job Title], [Company], [MMM YYYY - MMM YYYY]\n- Implemented [project/feature] that improved [metric] by [X]%.\n- Optimized [process/system], reducing [time/cost] by [X]%.\n- Collaborated with [team] to deliver [outcome].\n\n[Job Title], [Company], [MMM YYYY - MMM YYYY]\n- Built [system] supporting [scale/users].\n- Led [initiative] and achieved [measurable result].\n\nEDUCATION\n[Degree], [Institution], [YYYY]\n\nCERTIFICATIONS\n[Certification Name], [Issuer], [YYYY]`,
    tailoringInstructions: [
      'Replace summary nouns and verbs with JD language.',
      'Mirror top 8 required skills from JD in Skills section.',
      'Rewrite each bullet to include one quantified result and one JD keyword.'
    ]
  },
  {
    id: 'ats-compact-mid-level',
    name: 'ATS Compact Mid-Level',
    bestFor: '3-8 years experience, concise one-page resumes',
    expectedAtsScoreRange: '86-94',
    whyItScoresWell: [
      'Compact content density with explicit labels',
      'Straightforward bullets and date format consistency',
      'Optimized for recruiter skim and ATS token extraction'
    ],
    headings: ['Summary', 'Skills', 'Experience', 'Education'],
    templateText: `FULL NAME\nEmail | Phone | LinkedIn | GitHub\n\nSUMMARY\n[Role] with [X] years experience building [systems/products]. Strong in [skill stack].\n\nSKILLS\n[Skill 1], [Skill 2], [Skill 3], [Skill 4], [Skill 5], [Skill 6]\n\nEXPERIENCE\n[Role] | [Company] | [MMM YYYY - Present]\n- Delivered [feature] used by [X users], improving [KPI] by [X]%.\n- Automated [process], saving [X hours/month].\n- Partnered with [stakeholders] to ship [initiative].\n\n[Role] | [Company] | [MMM YYYY - MMM YYYY]\n- Reduced incident rate by [X]% via [action].\n- Implemented [tool/workflow] to improve [metric].\n\nEDUCATION\n[Degree], [Institution], [YYYY]`,
    tailoringInstructions: [
      'Move JD-critical tools to beginning of Skills line.',
      'Use JD verbs in first 2 bullets of latest role.',
      'Keep bullets to 1 line each for clean ATS parsing.'
    ]
  },
  {
    id: 'ats-skills-forward',
    name: 'ATS Skills-Forward',
    bestFor: 'Career changers and technical specialists',
    expectedAtsScoreRange: '84-93',
    whyItScoresWell: [
      'High keyword density in skills section',
      'Maintains standard headings ATS expects',
      'Maps transferable skills to measurable outcomes'
    ],
    headings: ['Summary', 'Skills', 'Projects', 'Experience', 'Education', 'Certifications'],
    templateText: `FULL NAME\nEmail | Phone | LinkedIn\n\nSUMMARY\n[Target Role] professional with strengths in [top capabilities]. Delivered outcomes in [industry/domain].\n\nSKILLS\nCore: [skill1], [skill2], [skill3], [skill4]\nTools: [tool1], [tool2], [tool3]\nMethods: [Agile, CI/CD, Testing, Documentation]\n\nPROJECTS\n[Project Name]\n- Built [solution] using [tech], resulting in [metric].\n- Integrated [system/API], improving [KPI].\n\nEXPERIENCE\n[Role], [Company], [MMM YYYY - MMM YYYY]\n- Applied [skill] to deliver [result].\n- Coordinated [initiative], increasing [metric] by [X]%.\n\nEDUCATION\n[Degree], [Institution], [YYYY]\n\nCERTIFICATIONS\n[Certification], [Issuer], [YYYY]`,
    tailoringInstructions: [
      'Map each JD requirement to one skill or project bullet.',
      'Include exact JD technologies in Skills and Projects.',
      'For transitions, emphasize transferable outcomes not responsibilities.'
    ]
  },
  {
    id: 'ats-entry-level-impact',
    name: 'ATS Entry-Level Impact',
    bestFor: 'Students, interns, and new graduates',
    expectedAtsScoreRange: '82-91',
    whyItScoresWell: [
      'Prioritizes projects and internships for limited full-time history',
      'Uses standard section names and ATS-safe bullets',
      'Highlights impact metrics despite shorter tenure'
    ],
    headings: ['Summary', 'Skills', 'Projects', 'Internship Experience', 'Education'],
    templateText: `FULL NAME\nEmail | Phone | LinkedIn | Portfolio\n\nSUMMARY\nRecent [Degree] graduate focused on [domain]. Hands-on experience in [tech stack] through internships and projects.\n\nSKILLS\n[Programming], [Frameworks], [Databases], [Tools]\n\nPROJECTS\n[Project]\n- Developed [application/system] with [tech stack].\n- Improved [metric] by [X]% through [method].\n\nINTERNSHIP EXPERIENCE\n[Intern Role], [Company], [MMM YYYY - MMM YYYY]\n- Supported [team/process] and delivered [result].\n- Created [feature/report], reducing [time/errors] by [X]%.\n\nEDUCATION\n[Degree], [Institution], [YYYY]\nRelevant Coursework: [course1], [course2], [course3]`,
    tailoringInstructions: [
      'Align coursework/projects with JD responsibilities.',
      'Use internship bullets to show ownership and measurable outcomes.',
      'Add JD keywords in project descriptions naturally.'
    ]
  },
  {
    id: 'ats-senior-leadership',
    name: 'ATS Senior Leadership',
    bestFor: 'Senior ICs, managers, and leadership roles',
    expectedAtsScoreRange: '87-95',
    whyItScoresWell: [
      'Balances strategic and technical keywords',
      'Chronological leadership impact and team scope',
      'Strong date and role clarity for ATS ranking'
    ],
    headings: ['Summary', 'Core Competencies', 'Experience', 'Education', 'Certifications'],
    templateText: `FULL NAME\nEmail | Phone | LinkedIn\n\nSUMMARY\nSenior [Role] with [X]+ years leading [teams/programs] in [domain]. Expertise in [capability1], [capability2], [capability3].\n\nCORE COMPETENCIES\n[Architecture], [Delivery], [Stakeholder Management], [Mentoring], [Budgeting], [Cloud]\n\nEXPERIENCE\n[Senior Role], [Company], [MMM YYYY - Present]\n- Led team of [X] to deliver [initiative], increasing [business KPI] by [X]%.\n- Defined roadmap and reduced cycle time by [X]%.\n- Mentored engineers/managers, improving retention/performance metrics.\n\n[Role], [Company], [MMM YYYY - MMM YYYY]\n- Executed [program], producing [impact].\n- Built standards/processes that improved [quality/cost].\n\nEDUCATION\n[Degree], [Institution], [YYYY]\n\nCERTIFICATIONS\n[Certification], [Issuer], [YYYY]`,
    tailoringInstructions: [
      'Mirror leadership and business outcome terms from JD.',
      'Quantify team size, budget, and impact in first bullet per role.',
      'Include both strategy and hands-on technical keywords from JD.'
    ]
  }
];

const getTemplateFitGuidance = (roleBucket) => {
  if (roleBucket === 'Frontend') {
    return 'Use ATS Compact Mid-Level or ATS Skills-Forward and prioritize UI stack keywords from JD.';
  }
  if (roleBucket === 'Backend') {
    return 'Use ATS Classic Chronological or ATS Senior Leadership depending on experience level.';
  }
  if (roleBucket === 'Data / Analytics') {
    return 'Use ATS Skills-Forward to emphasize SQL, analytics tools, and measurable business outcomes.';
  }
  return 'Start with ATS Classic Chronological, then tailor keywords to the target JD.';
};

module.exports = { ATS_TEMPLATES, getTemplateFitGuidance };
