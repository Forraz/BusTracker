import "dotenv/config";


export function getDBUrl(): string {

    const dbName = process.env.DATABASE_NAME ?? "";
    const dbUser = process.env.DATABASE_USER ?? "";
    const dbPassword = process.env.DATABASE_PASSWORD ?? "";
    const dbHost = process.env.DATABASE_HOST ?? "";

    return `postgresql://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

}
