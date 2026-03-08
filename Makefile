pkm = bun

help:
	@echo "Available commands:"
	@echo "  make install         Install dependencies"
	@echo
	@echo "  make build-packages  Build packages"
	@echo "  make build-web       Build the web application"
	@echo "  make build-dashboard Build the dashboard application"
	@echo "  make build-android   Build the Android app"
	@echo
	@echo "  make dev-web         Start web development server"
	@echo "  make dev-dashboard   Start dashboard development server"
	@echo "  make dev-android     Start Android development server"
	@echo
	@echo "  make lint            Lint code using oxlint"
	@echo "  make format          Format code using oxfmt"

install:
	@echo "Installing dependencies..."
	@$(pkm) install

build-packages:
	@echo "Building packages..."
	@$(pkm) turbo --filter './packages/*' build --ui=stream-with-experimental-timestamps

build-web:
	@echo "Building application..."
	@$(pkm) turbo --filter @yukinu/web build --ui=stream-with-experimental-timestamps

build-dashboard:
	@echo "Building dashboard..."
	@$(pkm) turbo --filter @yukinu/dashboard build --ui=stream-with-experimental-timestamps

build-android:
	@echo "Building Android app..."
	@cd apps/mobile/android && ./gradlew assembleRelease

build-ios:
	@echo "Building IOS app..."
	@cd apps/mobile/ios && xcodebuild -scheme "Yukinu" -configuration Release -archivePath build/Yukinu.xcarchive archive
	@xcodebuild -exportArchive -archivePath apps/mobile/ios/build/Yukinu.xcarchive -exportPath apps/mobile/ios/build -exportOptionsPlist exportOptions.plist


db-migrate:
	@echo "Running database migrations..."
	@$(pkm) --env-file=.env --filter @yukinu/db db:migrate

db-studio:
	@echo "Starting database studio..."
	@$(pkm) --env-file=.env --filter @yukinu/db db:studio

dev-web:
	@echo "Starting development server..."
	@$(pkm) turbo --filter @yukinu/web dev --continue

dev-dashboard:
	@echo "Starting dashboard development server..."
	@$(pkm) turbo --filter @yukinu/dashboard dev --continue

dev-android:
	@echo "Starting Android development server..."
	@$(pkm) turbo --filter @yukinu/mobile start --continue


lint:
	@echo "Linting code..."
	@./node_modules/.bin/oxlint --fix

format:
	@echo "Formatting code..."
	@./node_modules/.bin/oxfmt --write
