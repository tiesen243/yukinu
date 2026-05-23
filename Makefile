pkm = bun

help:
	@echo "Available commands:"
	@echo "  make install         Install dependencies"
	@echo
	@echo "  make buil-deps       Build dependency packages"
	@echo "  make build-web       Build the web application"
	@echo "  make build-dashboard Build the dashboard application"
	@echo
	@echo "  make lint            Lint code using oxlint"
	@echo "  make format          Format code using oxfmt"

install:
	@echo "Installing dependencies..."
	@$(pkm) install

build-deps:
	@echo "Building dependency packages..."
	@$(pkm) turbo --filter './packages/*' build --ui=stream-with-experimental-timestamps

build-web:
	@echo "Building application..."
	@$(pkm) turbo --filter @yukinu/web build --ui=stream-with-experimental-timestamps

build-dashboard:
	@echo "Building dashboard..."
	@$(pkm) turbo --filter @yukinu/dashboard build --ui=stream-with-experimental-timestamps

db-generate:
	@echo "Generating migration files..."
	@$(pkm) --filter @yukinu/db db:generate

db-migrate:
	@echo "Running database migrations..."
	@$(pkm) --filter @yukinu/db db:migrate

db-studio:
	@echo "Starting database studio..."
	@$(pkm) --filter @yukinu/db db:studio

lint:
	@echo "Linting code..."
	@./node_modules/.bin/oxlint --fix

format:
	@echo "Formatting code..."
	@./node_modules/.bin/oxfmt --write
