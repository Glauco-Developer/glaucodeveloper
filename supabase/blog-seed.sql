insert into public.blog_categories (name, slug)
values
  ('Product Launch', 'product-launch'),
  ('AI Engineering', 'ai-engineering'),
  ('DevOps for WordPress', 'devops-for-wordpress')
on conflict (slug) do update
set name = excluded.name;

with categories as (
  select id, slug
  from public.blog_categories
),
upsert_posts as (
  insert into public.blog_posts (
    slug,
    title,
    excerpt,
    intro,
    category_id,
    tags,
    cover_tone,
    sections,
    content_text,
    read_time,
    featured,
    published,
    published_at
  )
  values
    (
      'alldashai-launch-on-wordpress-org',
      'Launching All DashAI on WordPress.org: What Changed, What Matters, and Why It Ships Better',
      'A practical breakdown of the All DashAI launch on the WordPress.org plugin directory, the product decisions behind version 2.2.0, and what the release means for WordPress teams that need clearer operational visibility.',
      'Shipping a plugin to the WordPress.org directory is never just a distribution event. It is the moment where your architecture, your product positioning, your compliance work, and your user experience all get compressed into one public artifact. For All DashAI, the launch was important because it turned a private operational idea into a directory-ready plugin with a clearer promise: help WordPress teams understand health, logs, and maintenance risks faster.',
      (select id from categories where slug = 'product-launch'),
      array['All DashAI', 'WordPress Plugin', 'Product Launch', 'Observability'],
      'linear-gradient(135deg,#052e16 0%,#14532d 38%,#111827 100%)',
      '[
        {
          "title": "What the WordPress.org launch actually represents",
          "body": [
            "The release of All DashAI on WordPress.org matters because it forces a product to become legible to real users outside the safety of an internal roadmap. On the public listing, the promise has to be obvious: diagnose WordPress issues faster, monitor health signals, read logs with more context, and keep maintenance work documented.",
            "The public description now frames the plugin around a few concrete outcomes: system health auditing, a logs viewer, an optional knowledge center for project assets, AI insights powered by a bring-your-own-key model, and weekly monitoring reports. That is a stronger product story than a vague AI dashboard label because it explains what the plugin helps a team do every week."
          ]
        },
        {
          "title": "The product signals that stood out in version 2.2.0",
          "body": [
            "One of the most meaningful changes in the public changelog is not flashy at all: the plugin became a single fully functional WordPress.org version instead of a built-in tiered experience. That simplifies the mental model for users and removes friction during evaluation.",
            "The rest of the version 2.2.0 notes are also revealing. Simplifying bootstrap logic, centralizing admin assets, and tightening privacy-facing settings are exactly the kinds of changes that make a plugin easier to maintain and easier to trust. Good launches are often won by these invisible structural decisions."
          ]
        },
        {
          "title": "Why All DashAI has a strong positioning angle",
          "body": [
            "The main site and the plugin page tell a consistent story: All DashAI is less about generic AI hype and more about operational clarity for WordPress fleets. The language around real-time tracking, weekly reports, centralized project intelligence, and root-cause AI diagnostics gives the product a workflow-shaped identity.",
            "That matters because agencies and maintenance teams do not buy raw features. They buy speed during incidents, cleaner reporting, faster handoffs, and fewer support surprises. The launch works when users can picture those outcomes immediately."
          ]
        },
        {
          "title": "Lessons worth carrying into the next release",
          "body": [
            "The strongest next step after a launch like this is to keep tightening the connection between product language and real evidence inside the UI. When a plugin claims it reduces guesswork, the interface should make that reduction visible through summaries, timelines, and clearer prioritization.",
            "For independent makers, this is the practical lesson: a public launch is not the finish line. It is the first time the product has to defend itself in plain sight. If the listing, documentation, and in-product structure all tell the same story, the launch keeps compounding after release day."
          ]
        }
      ]'::jsonb,
      'Shipping a plugin to the WordPress.org directory is never just a distribution event. It is the moment where your architecture, your product positioning, your compliance work, and your user experience all get compressed into one public artifact. The release of All DashAI on WordPress.org matters because it forces a product to become legible to real users outside the safety of an internal roadmap. On the public listing, the promise has to be obvious: diagnose WordPress issues faster, monitor health signals, read logs with more context, and keep maintenance work documented. The public description now frames the plugin around a few concrete outcomes: system health auditing, a logs viewer, an optional knowledge center for project assets, AI insights powered by a bring-your-own-key model, and weekly monitoring reports. One of the most meaningful changes in the public changelog is not flashy at all: the plugin became a single fully functional WordPress.org version instead of a built-in tiered experience. The main site and the plugin page tell a consistent story: All DashAI is less about generic AI hype and more about operational clarity for WordPress fleets.',
      '8 min read',
      true,
      true,
      '2026-06-18T12:00:00Z'
    ),
    (
      'building-a-supabase-vector-database-for-rag-in-nextjs',
      'How to Build a Supabase Vector Database for RAG in Next.js Without Making the Architecture Mysterious',
      'A didactic guide to building a practical vector-backed RAG pipeline with Supabase and Next.js, from schema design and ingestion to retrieval and prompt assembly.',
      'A lot of RAG tutorials make the architecture sound magical when it is actually a sequence of very ordinary backend decisions. You store source material, split it into chunks, generate embeddings, persist vectors, retrieve the closest matches for a user question, and then inject those matches into the prompt. Supabase and Next.js are a good pairing here because they let you keep the data pipeline and the application pipeline close together.',
      (select id from categories where slug = 'ai-engineering'),
      array['Supabase', 'RAG', 'Vector Database', 'Next.js'],
      'linear-gradient(135deg,#0f172a 0%,#1d4ed8 45%,#0f766e 100%)',
      '[
        {
          "title": "Think in stages, not in buzzwords",
          "body": [
            "The cleanest way to understand RAG is to break it into five stages: source storage, chunking, embedding generation, vector storage, and retrieval. Once those stages are explicit, the system stops feeling like AI magic and starts looking like an ordinary data pipeline with one numerical search step in the middle.",
            "In a Next.js app, this clarity matters because you already have several boundaries to manage: server components, route handlers, server actions, and background-style tasks triggered by user actions. A staged mental model helps you decide where each concern should live."
          ]
        },
        {
          "title": "What Supabase should store",
          "body": [
            "At minimum, you want one table for the original source and another for its chunks. The source table keeps the document-level identity, such as title, URL, or file name. The chunks table stores the chunk text, metadata like position, and the embedding vector.",
            "The useful part of Supabase is that Postgres, pgvector, auth, and storage can all stay in one system. That removes a lot of accidental complexity from a small or medium-sized product."
          ]
        },
        {
          "title": "Where Next.js fits in the pipeline",
          "body": [
            "Next.js is a good place to orchestrate ingestion because server actions and route handlers give you predictable server-side entry points. A CMS form can upload or submit content, a server action can normalize and chunk it, and the backend can then call an embeddings API before storing vectors in Supabase.",
            "Retrieval is usually even simpler. When the user asks a question, the backend generates one embedding for that query, runs a similarity search in Supabase, selects the best chunks, and assembles a prompt that includes only the relevant context."
          ]
        },
        {
          "title": "The practical design rule that keeps RAG usable",
          "body": [
            "The best RAG systems are not the ones with the most abstractions. They are the ones where you can answer simple operational questions quickly: what source produced this chunk, when was it indexed, why was this result retrieved, and how do I replace stale context.",
            "That is why a boring schema is often the right schema. If your team can inspect the source row, the chunk rows, and the query result without needing a whiteboard session, the architecture is doing its job."
          ]
        }
      ]'::jsonb,
      'A lot of RAG tutorials make the architecture sound magical when it is actually a sequence of very ordinary backend decisions. You store source material, split it into chunks, generate embeddings, persist vectors, retrieve the closest matches for a user question, and then inject those matches into the prompt. The cleanest way to understand RAG is to break it into five stages: source storage, chunking, embedding generation, vector storage, and retrieval. At minimum, you want one table for the original source and another for its chunks. The source table keeps the document-level identity, such as title, URL, or file name. The chunks table stores the chunk text, metadata like position, and the embedding vector. Next.js is a good place to orchestrate ingestion because server actions and route handlers give you predictable server-side entry points. The best RAG systems are not the ones with the most abstractions. They are the ones where you can answer simple operational questions quickly.',
      '9 min read',
      false,
      true,
      '2026-06-17T12:00:00Z'
    ),
    (
      'running-wordpress-with-docker-without-making-local-dev-fragile',
      'Running WordPress with Docker Without Making Local Development Fragile',
      'A practical guide to what Docker is, why it helps WordPress development, and how to run WordPress locally with containers in a way that stays understandable and repeatable.',
      'Docker becomes useful for WordPress the moment you stop thinking of it as a DevOps badge and start treating it as a reproducible local environment. WordPress needs PHP, a web server, and a database. Docker lets you define those moving parts once and recreate them on any machine without rebuilding the whole stack by hand every time.',
      (select id from categories where slug = 'devops-for-wordpress'),
      array['Docker', 'WordPress', 'Local Development', 'DevOps'],
      'linear-gradient(135deg,#0c4a6e 0%,#1e293b 52%,#111827 100%)',
      '[
        {
          "title": "What Docker is in plain language",
          "body": [
            "Docker packages an application and its runtime dependencies into containers so that the environment is predictable. For WordPress, that means you can define the app container and the database container once and then stop relying on whatever happens to be installed globally on your machine.",
            "That predictability is why Docker is so useful for teaching and for teams. It reduces the phrase it works on my machine from an annoying joke to a rare event."
          ]
        },
        {
          "title": "Why WordPress benefits from containerized local development",
          "body": [
            "A WordPress project usually needs multiple services running together: PHP, Apache or Nginx, MySQL or MariaDB, and often extras like Mailpit, phpMyAdmin, or Redis. Installing and aligning those manually is where local environments become brittle.",
            "Docker Compose gives you one place to describe that stack. The application becomes easier to start, easier to reset, and easier to share with another developer."
          ]
        },
        {
          "title": "The minimal mental model for a Compose setup",
          "body": [
            "A Compose file is just a list of services and the relationships between them. For a small WordPress setup, you usually need a `wordpress` service, a `db` service, named volumes for persistent data, and environment variables for credentials.",
            "Once that file exists, your daily workflow becomes much simpler: `docker compose up -d` to start, `docker compose ps` to inspect, and `docker compose down` when you want to stop the environment. The setup becomes a documented system instead of tribal knowledge."
          ]
        },
        {
          "title": "What makes a Docker-based WordPress setup healthy over time",
          "body": [
            "The healthiest Docker setups are the ones that remain boring. Keep service names clear, pin image versions intentionally, persist database data with volumes, and document the small commands your future self will forget.",
            "When Docker improves clarity instead of performing complexity, it becomes exactly what local development needs: a reliable machine for recreating the same WordPress stack on demand."
          ]
        }
      ]'::jsonb,
      'Docker becomes useful for WordPress the moment you stop thinking of it as a DevOps badge and start treating it as a reproducible local environment. WordPress needs PHP, a web server, and a database. Docker lets you define those moving parts once and recreate them on any machine without rebuilding the whole stack by hand every time. Docker packages an application and its runtime dependencies into containers so that the environment is predictable. A WordPress project usually needs multiple services running together: PHP, Apache or Nginx, MySQL or MariaDB, and often extras like Mailpit, phpMyAdmin, or Redis. Docker Compose gives you one place to describe that stack. A Compose file is just a list of services and the relationships between them. The healthiest Docker setups are the ones that remain boring.',
      '7 min read',
      false,
      true,
      '2026-06-16T12:00:00Z'
    )
  on conflict (slug) do update
  set
    title = excluded.title,
    excerpt = excluded.excerpt,
    intro = excluded.intro,
    category_id = excluded.category_id,
    tags = excluded.tags,
    cover_tone = excluded.cover_tone,
    sections = excluded.sections,
    content_text = excluded.content_text,
    read_time = excluded.read_time,
    featured = excluded.featured,
    published = excluded.published,
    published_at = excluded.published_at
  returning slug
)
select slug from upsert_posts;
