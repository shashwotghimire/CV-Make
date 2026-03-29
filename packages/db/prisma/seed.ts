import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const overleafInspiredTemplate = String.raw`<main style="font-family:'Lato','Helvetica Neue',Helvetica,Arial,sans-serif;width:7.5in;max-width:100%;margin:0 auto;padding:0 2px;color:#111;background:#fff;font-size:10.4pt;line-height:1.14;overflow-wrap:anywhere;">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; }
    p, ul, li { margin: 0; padding: 0; }
    a { color: #111; text-decoration: underline; text-underline-offset: 1px; }

    .resume-header { text-align: center; margin: 0 0 6px; }
    .resume-name { margin: 0; font-size: 22pt; line-height: 1; font-weight: 700; }
    .resume-contact {
      margin-top: 4px;
      font-size: 10.6pt;
      line-height: 1.08;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      column-gap: 0;
      row-gap: 0;
    }
    .resume-contact span { display: inline-block; max-width: 100%; overflow-wrap: anywhere; }

    .resume-section { margin-top: 5px; }
    .resume-section-title {
      margin: 0;
      padding: 0 0 1px;
      font-size: 12.6pt;
      line-height: 1.05;
      font-weight: 500;
      letter-spacing: 0;
      font-variant: normal;
      text-transform: none;
      border-bottom: 1px solid #7c7c7c;
    }

    .summary-list {
      margin: 1px 0 2px 10px;
      font-size: 10.2pt;
      line-height: 1.06;
    }
    .summary-list li { margin: 0; }

    .resume-entry { margin-top: 1px; }
    .entry-primary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
      column-gap: 10px;
      margin-top: 0;
      padding-left: 2ch;
    }
    .entry-title { font-size: 10.8pt; font-weight: 700; line-height: 1.05; min-width: 0; overflow-wrap: anywhere; }
    .entry-right-title { font-size: 10.6pt; font-weight: 500; line-height: 1.05; max-width: 20ch; text-align: right; overflow-wrap: anywhere; }

    .entry-secondary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
      column-gap: 10px;
      margin-top: 0;
      padding-left: 2ch;
    }
    .entry-subtitle { font-size: 10.1pt; font-style: italic; line-height: 1.05; min-width: 0; overflow-wrap: anywhere; }
    .entry-right-subtitle { font-size: 10.1pt; font-style: italic; line-height: 1.05; max-width: 20ch; text-align: right; overflow-wrap: anywhere; }

    .entry-description { margin-top: 0; padding-left: 2ch; font-size: 10pt; line-height: 1.06; overflow-wrap: anywhere; }
    .entry-url { margin-top: 0; padding-left: 2ch; font-size: 10pt; line-height: 1.04; overflow-wrap: anywhere; }

    .entry-bullets {
      margin: 1px 0 2px 4.2ch;
      font-size: 10pt;
      line-height: 1.06;
    }
    .entry-bullets li { margin: 0; overflow-wrap: anywhere; }
    .entry-bullets li p { margin: 0; }

    .entry-tech { font-style: italic; font-weight: 400; }
  </style>

  <header class="resume-header">
    <h1 class="resume-name">{{profile.name}}</h1>
    <p class="resume-contact">
      {{#if profile.phone}}<span>&#9742; {{profile.phone}}</span>{{/if}}
      <span>{{#if profile.phone}} &nbsp;&nbsp; &#124; &nbsp;&nbsp; {{/if}}&#9993; {{profile.email}}</span>
      {{#if profile.linkedin}}<span>&nbsp;&nbsp; &#124; &nbsp;&nbsp;<a href="{{profile.linkedin}}">{{profile.linkedin}}</a></span>{{/if}}
      {{#if profile.github}}<span>&nbsp;&nbsp; &#124; &nbsp;&nbsp;<a href="{{profile.github}}">{{profile.github}}</a></span>{{/if}}
      {{#if profile.website}}<span>&nbsp;&nbsp; &#124; &nbsp;&nbsp;<a href="{{profile.website}}">{{profile.website}}</a></span>{{/if}}
    </p>
  </header>

  {{#each sections}}
    <section class="resume-section">
      <h2 class="resume-section-title">{{title}}</h2>

      {{#if summaryBullets.length}}
        <ul class="summary-list">
          {{#each summaryBullets}}
            <li>{{{this}}}</li>
          {{/each}}
        </ul>
      {{/if}}

      {{#each items}}
        <article class="resume-entry">
          <div class="entry-primary">
            <div class="entry-title">
              {{title}}{{#if technologies.length}} <span class="entry-tech">| {{#each technologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</span>{{/if}}
            </div>
            {{#if rightTitle}}<div class="entry-right-title">{{rightTitle}}</div>{{/if}}
          </div>

          <div class="entry-secondary">
            {{#if subtitle}}<div class="entry-subtitle">{{subtitle}}</div>{{else}}<div class="entry-subtitle"></div>{{/if}}
            {{#if rightSubtitle}}<div class="entry-right-subtitle">{{rightSubtitle}}</div>{{/if}}
          </div>

          {{#if description}}
            <p class="entry-description">{{description}}</p>
          {{/if}}

          {{#if url}}
            <p class="entry-url"><a href="{{url}}">{{url}}</a></p>
          {{/if}}

          {{#if bullets.length}}
            <ul class="entry-bullets">
              {{#each bullets}}
                <li>{{{this}}}</li>
              {{/each}}
            </ul>
          {{/if}}
        </article>
      {{/each}}
    </section>
  {{/each}}
</main>`;

async function main() {
  const adminClerkId = process.env.SEED_ADMIN_CLERK_USER_ID;

  if (adminClerkId) {
    await prisma.profile.upsert({
      where: { clerkUserId: adminClerkId },
      update: { role: Role.ADMIN },
      create: { clerkUserId: adminClerkId, role: Role.ADMIN },
    });
  }

  await prisma.template.upsert({
    where: { id: "starter-template" },
    update: {
      name: "SWE Resume Template",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      previewUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      templateHtml: overleafInspiredTemplate,
      isActive: true,
    },
    create: {
      id: "starter-template",
      name: "SWE Resume Template",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      previewUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      templateHtml: overleafInspiredTemplate,
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
