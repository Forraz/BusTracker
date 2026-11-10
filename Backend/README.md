## Setup

# Create .env file
```cp .env.example .env```

Setup your credentials in .env file. The postgres docker container will be created using those credentials.

# Start database container
```docker compose up -d```

# Install dependencies
```npm i```

# Generate migration and migrate
```npx drizzle-kit generate```
```npx drizzle-kit migrate```

## Usage

```npm run dev```

