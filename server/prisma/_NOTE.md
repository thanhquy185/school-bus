# CREATE 
npx prisma migrate dev --name init

## PUSH DATABASE (UPDATE SCHEMA)
npx prisma db push

## RELOAD DATABASE
npx prisma generate