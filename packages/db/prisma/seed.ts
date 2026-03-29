import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const overleafInspiredTemplate = String.raw`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font.css" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="m-0 bg-white">
<div class="max-w-[780px] mx-auto px-12 py-6 font-serif text-black text-sm leading-snug">
  <header class="text-center mb-2">
    <h1 class="m-0 text-[42px] leading-none font-bold">{{profile.name}}</h1>
    <p class="mt-1 text-sm leading-snug">
      {{#if profile.phone}}<span>&#9742; {{profile.phone}}</span>{{/if}}
      <span>{{#if profile.phone}} &nbsp;|&nbsp; {{/if}}&#9993; {{profile.email}}</span>
      {{#if profile.linkedin}}<span> &nbsp;|&nbsp; <a class="text-black no-underline" href="{{profile.linkedin}}">{{profile.linkedin}}</a></span>{{/if}}
      {{#if profile.github}}<span> &nbsp;|&nbsp; <a class="text-black no-underline" href="{{profile.github}}">{{profile.github}}</a></span>{{/if}}
      {{#if profile.website}}<span> &nbsp;|&nbsp; <a class="text-black no-underline" href="{{profile.website}}">{{profile.website}}</a></span>{{/if}}
    </p>
  </header>

  {{#each sections}}
    <section class="mt-2.5 text-black">
      <div>
        <p class="font-bold text-sm text-black">{{title}}</p>
        <hr class="border-0 border-t border-black my-0" />
      </div>

      {{#if summaryBullets.length}}
        <div class="mt-1">
          {{#each summaryBullets}}
            <div class="flex items-baseline gap-2 mb-0.5 pl-2.5 text-black">
              <span class="shrink-0 w-4 text-sm">•</span>
              <span class="flex-1 text-sm leading-snug break-words">{{{this}}}</span>
            </div>
          {{/each}}
        </div>
      {{/if}}

      <div class="mt-1">
        {{#each items}}
          <article class="mb-[5px] text-black">
            <div class="w-full pl-2">
              {{#if (eq type "SKILL")}}
                <p class="text-sm leading-snug">
                  <strong>{{title}}: </strong>
                  {{#if bullets.length}}
                    {{#each bullets}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
                  {{/if}}
                </p>
              {{else}}
                <div class="flex flex-row justify-between items-baseline w-full min-w-0 gap-2">
                  <span class="font-bold text-sm flex-1 min-w-0 break-words">
                    {{title}}{{#if technologies.length}} <span class="italic font-normal">| {{#each technologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</span>{{/if}}
                  </span>
                  {{#if rightTitle}}<span class="text-sm whitespace-nowrap shrink-0 pl-3">{{rightTitle}}</span>{{/if}}
                </div>

                <div class="flex justify-between items-baseline w-full min-w-0 italic">
                  {{#if subtitle}}<span class="italic text-sm flex-1 min-w-0 break-words">{{subtitle}}</span>{{else}}<span class="italic text-sm flex-1 min-w-0"></span>{{/if}}
                  {{#if rightSubtitle}}<span class="italic text-sm whitespace-nowrap shrink-0 pl-3">{{rightSubtitle}}</span>{{/if}}
                </div>

                {{#if description}}
                  <p class="text-sm leading-snug break-words">{{description}}</p>
                {{/if}}

                {{#if url}}
                  <p class="text-sm leading-snug break-words"><a class="text-black no-underline" href="{{url}}">{{url}}</a></p>
                {{/if}}

                {{#if bullets.length}}
                  <div class="mt-0.5">
                    {{#each bullets}}
                      <div class="flex items-baseline gap-2 mb-0.5 pl-2.5 text-black">
                        <span class="shrink-0 w-4 text-sm">•</span>
                        <span class="flex-1 text-sm leading-snug break-words">{{{this}}}</span>
                      </div>
                    {{/each}}
                  </div>
                {{/if}}
              {{/if}}
            </div>
          </article>
        {{/each}}
      </div>
    </section>
  {{/each}}
</div>
</body>
</html>`;

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
