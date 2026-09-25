# Backend — especificação para o projeto paralelo

Export de vídeo é 100% no cliente, então **não há render server**. Backend cuida de identidade, armazenamento, catálogo de packs e sync de projetos.

## Stack sugerida

Node (Fastify ou NestJS) · Postgres (Prisma) · S3/Cloudflare R2 + CDN · Redis (cache, rate limit) · BullMQ (jobs de thumbnail) · OpenAPI.

## Contrato compartilhado

Schemas Zod de `manifest`, `AnimationClip`, `Project` vivem num pacote `@engine/schemas` consumido pelo front e pelo back (mesma validação nos dois lados). Até existir, o front é a fonte.

## Tasks

- [ ] **B0** Contrato OpenAPI primeiro (endpoints abaixo) + mock server para o front.
- [ ] **B1** Auth: OAuth (Google/GitHub) + JWT access/refresh; roles `user`, `creator`, `admin`.
- [ ] **B2** Storage: upload por presigned URL (S3/R2), dedupe por sha-256, quotas por usuário, CDN.
- [ ] **B3** Pack registry: CRUD, versões semver imutáveis, publish/unpublish, validação do manifest, licença.
- [ ] **B4** Catálogo: busca (full-text + tags + categoria: cenário/personagem/clip/transição), paginação, favoritos, contagem de downloads.
- [ ] **B5** Projetos: salvar/sync (JSON + refs), histórico de versões, autosave, link de compartilhamento.
- [ ] **B6** Worker de thumbnails/previews (sharp) disparado no upload.
- [ ] **B7** Exports: upload opcional do vídeo gerado no cliente + link público.
- [ ] **B8** (futuro) Marketplace: packs pagos (Stripe), payouts para creators.

## Endpoints (rascunho)

| Método         | Rota                                   | Descrição                                |
| -------------- | -------------------------------------- | ---------------------------------------- |
| POST           | `/auth/oauth/:provider`                | login                                    |
| POST           | `/auth/refresh`                        | renova token                             |
| GET            | `/me`                                  | perfil                                   |
| GET            | `/catalog/search?q=&type=&tags=&page=` | busca no hub                             |
| GET/POST       | `/packs`                               | listar / criar pack                      |
| GET            | `/packs/:id`                           | detalhes                                 |
| GET/POST       | `/packs/:id/versions`                  | versões / publicar nova                  |
| GET            | `/packs/:id/versions/:v/download`      | URL assinada do `.aepack`                |
| POST           | `/assets/upload-url`                   | presigned URL (body: sha256, mime, size) |
| GET/POST       | `/projects`                            | listar / criar                           |
| GET/PUT/DELETE | `/projects/:id`                        | projeto                                  |
| GET            | `/projects/:id/versions`               | histórico                                |
| POST           | `/exports`                             | registrar vídeo exportado                |

## Modelo de dados (rascunho)

`users` · `packs(id, owner_id, slug, name, visibility)` · `pack_versions(pack_id, version, manifest jsonb, archive_key, published_at)` · `assets(sha256 pk, mime, size, storage_key)` · `pack_version_assets` · `projects(id, owner_id, data jsonb, schema_version, updated_at)` · `project_versions` · `favorites` · `exports`.
