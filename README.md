# project

How to run my Nextjs app
- npm install
- cp .env.example .env

* Fill yourself database config at .env file *

- npx prisma migrate dev --name "first_migrate"
- npx prisma generate
- npm run prisma:seed

- npm run dev

Every folder in app is a route

.root/app/admin/dashboard = admin/dashboard
.root/app/admin/dashboard/users/[id]/edit = admin/dashboard/users/1/edit

Create component use Shadcn

npx shadcn@latest add label
npx shadcn@latest add input
npx shadcn@latest add button

# Bye from Setsu