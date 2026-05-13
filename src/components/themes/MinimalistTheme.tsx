import React from 'react';
import { CVData, ThemeConfig } from '../types';

interface MinimalistThemeProps {
  data: CVData;
  theme: ThemeConfig;
}

export function MinimalistTheme({ data, theme }: MinimalistThemeProps) {
  return (
    <div
      className="p-10 w-full h-full min-h-[1100px]"
      style={{
        fontFamily: theme.font,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <header className="border-b-[3px] pb-6 mb-8" style={{ borderColor: theme.primaryColor }}>
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide" style={{ color: theme.primaryColor }}>
          {data.personal.name}
        </h1>
        <div className="text-xl opacity-80 mb-4">{data.personal.role}</div>
        <div className="flex flex-wrap gap-4 text-sm opacity-70">
          <span>{data.personal.email}</span>
          <span>•</span>
          <span>{data.personal.phone}</span>
          <span>•</span>
          <span>{data.personal.location}</span>
          {data.personal.website && (
            <>
              <span>•</span>
              <span>{data.personal.website}</span>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider" style={{ color: theme.primaryColor }}>Profile</h2>
            <p className="leading-relaxed opacity-90">{data.personal.summary}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider" style={{ color: theme.primaryColor }}>Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold">{exp.position}</h3>
                    <span className="text-sm opacity-70 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-md font-medium opacity-80 mb-2" style={{ color: theme.primaryColor }}>{exp.company}</div>
                  <ul className="list-disc list-outside ml-4 space-y-1 opacity-90 text-sm">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx} className="pl-1 leading-relaxed">{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: theme.primaryColor }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: theme.primaryColor }}>Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <div className="text-sm opacity-80">{edu.institution}</div>
                  <div className="text-xs opacity-60 mt-1">{edu.date}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
