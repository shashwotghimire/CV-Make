import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const overleafInspiredTemplate = String.raw`<main style="font-family:'Computer Modern','CMU Serif',Georgia,'Times New Roman',serif;max-width:750px;margin:0 auto;padding:24px 48px;color:#000000;background:#ffffff;font-size:14px;line-height:1.25;letter-spacing:0;">
  <style>
    @import url('https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font.css');

    * { box-sizing: border-box; }
    body { margin: 0; }
    p { margin: 0; }
    ul, li { margin: 0; }
    a { color: #000000; text-decoration: underline; }

    .resume-header { text-align: center; margin: 0 0 8px; }
    .resume-name { margin: 0; font-size: 42px; line-height: 1; font-weight: 700; }
    .resume-contact {
      margin-top: 3px;
      font-size: 13px;
      line-height: 1.15;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      column-gap: 2px;
      row-gap: 0;
    }
    .resume-contact span { display: inline-block; max-width: 100%; overflow-wrap: break-word; }

    .resume-section { margin-top: 10px; }
    .resume-section-title {
      margin: 0 0 1px 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.15;
      font-weight: 700;
      letter-spacing: 0;
      font-variant: normal;
      text-transform: none;
    }
    .section-rule {
      border: none;
      border-top: 1px solid #000;
      margin: 0 0 4px 0;
    }

    .summary-list {
      margin-top: 2px;
      margin-bottom: 0;
      padding-left: 1.5em;
      list-style-type: disc;
      list-style-position: outside;
      font-size: 13px;
      line-height: 1.3;
    }
    .summary-list li { margin-bottom: 1px; padding-left: 0; overflow-wrap: break-word; }

    .resume-entry { margin: 0 0 5px 0; }
    .entry-primary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: baseline;
      column-gap: 12px;
      margin-top: 0;
      padding-left: 1.5em;
    }
    .entry-title { font-size: 13px; font-weight: 700; line-height: 1.25; min-width: 0; overflow-wrap: break-word; }
    .entry-right-title { font-size: 13px; font-weight: 400; line-height: 1.25; max-width: 24ch; text-align: right; overflow-wrap: break-word; }

    .entry-secondary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: baseline;
      column-gap: 12px;
      margin-top: 0;
      padding-left: 1.5em;
    }
    .entry-subtitle { font-size: 13px; font-style: italic; line-height: 1.25; min-width: 0; overflow-wrap: break-word; }
    .entry-right-subtitle { font-size: 13px; font-style: italic; line-height: 1.25; max-width: 24ch; text-align: right; overflow-wrap: break-word; }

    .entry-description { margin-top: 0; padding-left: 1.5em; font-size: 13px; line-height: 1.25; overflow-wrap: break-word; }
    .entry-url { margin-top: 0; padding-left: 1.5em; font-size: 13px; line-height: 1.25; overflow-wrap: break-word; }

    .entry-bullets {
      margin-top: 2px;
      margin-bottom: 0;
      padding-left: 1.5em;
      list-style-type: disc;
      list-style-position: outside;
      font-size: 13px;
      line-height: 1.3;
    }
    .entry-bullets li { margin-bottom: 1px; line-height: 1.3; padding-left: 0; overflow-wrap: break-word; }
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
      <hr class="section-rule" />

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
