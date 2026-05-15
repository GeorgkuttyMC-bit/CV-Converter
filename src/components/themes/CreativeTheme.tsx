import React from 'react';
import { CVData, ThemeConfig } from '../types';

interface CreativeThemeProps {
  data: CVData;
  theme: ThemeConfig;
}

export function CreativeTheme({ data, theme }: CreativeThemeProps) {
  return (
    <div
      className="flex w-full h-full min-h-[1100px]"
      style={{
        fontFamily: theme.font,
        backgroundColor: theme.backgroundColor,
      }}
    >
      {/* Sidebar */}
      <div 
        className="w-1/3 p-10 flex flex-col" 
        style={{ backgroundColor: theme.primaryColor, color: '#ffffff' }}
      >
        <div className="mb-10 mt-4 rounded-full w-32 h-32 flex items-center justify-center text-4xl font-bold mx-auto shadow-lg" style={{ backgroundColor: '#ffffff', color: theme.primaryColor }}>
          {data.personal.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-1 leading-tight">
          {data.personal.name}
        </h1>
        <div className="text-sm text-center opacity-90 uppercase tracking-widest mb-10 font-medium pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          {data.personal.role}
        </div>

        <div className="space-y-6 mb-10">
          <h2 className="text-lg font-bold tracking-wider uppercase border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Contact</h2>
          <div className="space-y-3 text-sm opacity-90">
            <div className="flex items-center gap-3">
              <span className="break-all">{data.personal.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{data.personal.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{data.personal.location}</span>
            </div>
            {data.personal.website && (
              <div className="flex items-center gap-3">
                <span className="break-all">{data.personal.website}</span>
              </div>
            )}
            {data.personal.linkedin && (
              <div className="flex items-center gap-3">
                <span className="break-all">{data.personal.linkedin}</span>
              </div>
            )}
            {data.personal.github && (
              <div className="flex items-center gap-3">
                <span className="break-all">{data.personal.github}</span>
              </div>
            )}
            {data.personal.portfolio && (
              <div className="flex items-center gap-3">
                <span className="break-all">{data.personal.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold tracking-wider uppercase border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold text-md leading-tight">{edu.degree}</h3>
                <div className="text-sm opacity-90">{edu.institution}</div>
                <div className="text-xs opacity-70 mt-1">{edu.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-10 flex flex-col" style={{ color: theme.textColor }}>
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: theme.primaryColor }}>
            <span className="w-8 h-1 inline-block" style={{ backgroundColor: theme.primaryColor }}></span>
            About Me
          </h2>
          <p className="leading-relaxed opacity-90 text-sm">{data.personal.summary}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primaryColor }}>
            <span className="w-8 h-1 inline-block" style={{ backgroundColor: theme.primaryColor }}></span>
            Experience
          </h2>
          <div className="space-y-6 border-l-2 ml-2 pl-6" style={{ borderColor: `${theme.primaryColor}40` }}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative">
                <div 
                  className="absolute w-3 h-3 rounded-full top-1.5"
                  style={{ backgroundColor: theme.primaryColor, left: '-29px' }}
                />
                <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: theme.primaryColor }}>
                  {exp.startDate} - {exp.endDate}
                </div>
                <h3 className="text-xl font-bold">{exp.position}</h3>
                <div className="text-md opacity-80 mb-2 font-medium">{exp.company}</div>
                <ul className="list-none space-y-1 opacity-90 text-sm">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="relative pl-4 before:content-['▹'] before:absolute before:left-0">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.primaryColor }}>
            <span className="w-8 h-1 inline-block" style={{ backgroundColor: theme.primaryColor }}></span>
            Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, idx) => (
              <div
                key={idx}
                className="px-4 py-2 border text-sm font-medium shadow-sm transition-transform hover:-translate-y-1"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                {skill}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
