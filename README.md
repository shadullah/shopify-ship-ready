# ShipReady: Production-Ready Shopify Remix App Template

ShipReady is a comprehensive, production-ready template for building Shopify apps using the Remix framework. It's designed to accelerate your Shopify app development process, providing a robust foundation with pre-built features and best practices.

## Features

- **Shopify Integration**: Seamless integration with Shopify's API, including authentication, webhooks, and App Bridge.
- **Remix Framework**: Leverages the power of Remix for server-side rendering and optimal performance.
- **Pre-built Components**: Utilizes Shopify Polaris for a consistent, user-friendly interface.
- **Database Setup**: Includes Prisma ORM setup with SQLite (easily adaptable to other databases).
- **Billing Integration**: Ready-to-use subscription and one-time purchase billing models.
- **Webhook Handling**: Pre-configured webhook listeners for key Shopify events.
- **Analytics**: Basic analytics setup to track app usage and performance.
- **Comprehensive Documentation**: Extensive in-app documentation and video tutorials.

## Quick Start

### Prerequisites

1. **Node.js**: [Download and install](https://nodejs.org/en/download/) (v14 or later recommended)
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup)
3. **Shopify CLI**: Install via npm `npm install -g @shopify/cli@latest`

### Setup

1. Clone the repository:

    ```bash
      git clone https://github.com/Hujjat/ShipReady.git shipready
      cd shipready
    ```

2. Install dependencies:
  
      ```bash
        npm install
      ```

3. Create `.env` file from `.env.example` in the root folder with your app's credentials.

4. You can skip this step, only if it's your first time setup. If your `.toml` file is different form `shopify.app.toml` update [access_scopes] and [app_proxy] from `shopify.app.toml`, then run:

      ```bash
        npm run deploy
      ```

5. Start the development server:
  
      ```bash
        npm run dev
      ```

6. Open the provided URL to install and test your app in a development store.

7. For seeding your db run : (optional)
      ```bash
      npm run prisma db seed
      ```
## Documentation

Comprehensive documentation is available within the app. After installation, navigate to the "Docs" section in the app dashboard.

## Video Tutorials

Access our extensive library of video tutorials covering everything from basic setup to advanced app development techniques. Find these in the "Video Tutorials" section of the app.

## Deployment

ShipReady is designed to be easily deployable to various cloud platforms. For detailed deployment instructions, refer to our [Deployment Guide](link-to-deployment-guide).



ShipReady - Empowering Shopify developers to build and launch apps faster than ever before.

```
New shipfy
├─ .dockerignore
├─ .editorconfig
├─ .eslintignore
├─ .eslintrc.cjs
├─ .gitignore
├─ .graphqlrc.js
├─ .npmrc
├─ .prettierignore
├─ .shopify
│  └─ bundle
│     └─ 382a4f7b-908d-3a46-ed99-dc04ce436d38987c702b
│        ├─ assets
│        │  ├─ app.css
│        │  ├─ app.js
│        │  └─ thumbs-up.png
│        ├─ blocks
│        │  ├─ app-embed.liquid
│        │  ├─ delivery-time.liquid
│        │  └─ icon-with-text.liquid
│        ├─ locales
│        │  └─ en.default.json
│        └─ snippets
│           ├─ img-icon.liquid
│           └─ stars.liquid
├─ app
│  ├─ assets
│  │  ├─ arrowDownRight.jsx
│  │  ├─ arrowUpRight.jsx
│  │  ├─ custom-styles.css
│  │  └─ data.json
│  ├─ components
│  │  ├─ chart
│  │  │  ├─ customerOverTime.jsx
│  │  │  ├─ fulfilledOrdersOverTime.jsx
│  │  │  ├─ main
│  │  │  │  ├─ barChart.jsx
│  │  │  │  ├─ chartBase.jsx
│  │  │  │  ├─ donutChart.jsx
│  │  │  │  ├─ emptyState.jsx
│  │  │  │  ├─ heading.jsx
│  │  │  │  ├─ lineChart.jsx
│  │  │  │  ├─ simpleBarChart.jsx
│  │  │  │  ├─ sparkLineWidget.jsx
│  │  │  │  ├─ stackedAreaChart.jsx
│  │  │  │  ├─ widgetBase.jsx
│  │  │  │  └─ widgetHeading.jsx
│  │  │  ├─ returningCustomerRate.jsx
│  │  │  ├─ salesByChannels.jsx
│  │  │  ├─ sessionsByDeviceType.jsx
│  │  │  ├─ totalOrders.jsx
│  │  │  ├─ totalRevenue.jsx
│  │  │  ├─ totalSales.jsx
│  │  │  └─ userViews.jsx
│  │  ├─ contents
│  │  │  ├─ contentForm.jsx
│  │  │  └─ index.jsx
│  │  ├─ dashboard
│  │  │  ├─ analytics.jsx
│  │  │  ├─ appEmbedStatus.jsx
│  │  │  ├─ getStarted.jsx
│  │  │  ├─ index.jsx
│  │  │  └─ specs.jsx
│  │  ├─ faq
│  │  │  ├─ faqData.js
│  │  │  └─ index.jsx
│  │  ├─ nav
│  │  │  ├─ index.jsx
│  │  │  ├─ sideNavigation.jsx
│  │  │  └─ tabNavigation.jsx
│  │  ├─ pricing
│  │  │  ├─ cancelPlanModal.jsx
│  │  │  ├─ heading.jsx
│  │  │  ├─ index.jsx
│  │  │  ├─ legacyPlan.jsx
│  │  │  └─ plans.jsx
│  │  ├─ settings
│  │  │  ├─ addFeatureModal.jsx
│  │  │  ├─ changeLogs.jsx
│  │  │  ├─ deleteFeatureModal.jsx
│  │  │  ├─ featuresSettings.jsx
│  │  │  ├─ feedbackCard.jsx
│  │  │  ├─ generalSettings.jsx
│  │  │  ├─ index.jsx
│  │  │  ├─ notificationsSettings.jsx
│  │  │  └─ sideTabs.jsx
│  │  └─ shared
│  │     ├─ chartProvider.jsx
│  │     ├─ codeSnippet.jsx
│  │     ├─ loading.jsx
│  │     ├─ pageLayout.jsx
│  │     ├─ pageTitleBar.jsx
│  │     ├─ readyColorPicker.jsx
│  │     ├─ readyDatePicker.jsx
│  │     ├─ readyProductSelector.jsx
│  │     └─ readyTable.jsx
│  ├─ config
│  │  ├─ app.js
│  │  ├─ db.js
│  │  └─ shopify.js
│  ├─ entities
│  │  ├─ discount.js
│  │  ├─ metafield.js
│  │  ├─ metaobject.js
│  │  ├─ shipready.js
│  │  └─ webhook.js
│  ├─ entry.server.jsx
│  ├─ models
│  │  ├─ content.model.js
│  │  ├─ event.model.js
│  │  ├─ feature.model.js
│  │  ├─ product.model.js
│  │  └─ webhook.model.js
│  ├─ root.jsx
│  ├─ routes
│  │  ├─ api.events.jsx
│  │  ├─ app.contents.edit.$id.jsx
│  │  ├─ app.contents.new.jsx
│  │  ├─ app.contents._index.jsx
│  │  ├─ app.faq.jsx
│  │  ├─ app.jsx
│  │  ├─ app.pricing.jsx
│  │  ├─ app.settings.jsx
│  │  ├─ app._index.jsx
│  │  ├─ auth.$.jsx
│  │  ├─ auth.login
│  │  │  ├─ error.server.jsx
│  │  │  └─ route.jsx
│  │  ├─ webhooks.jsx
│  │  └─ _index
│  │     ├─ route.jsx
│  │     └─ styles.module.css
│  └─ utilities
│     └─ dataNormalizer.js
├─ Dockerfile
├─ env.d.ts
├─ extensions
│  ├─ .gitkeep
│  └─ theme-extension
│     ├─ .shopifyignore
│     ├─ assets
│     │  ├─ app.css
│     │  ├─ app.js
│     │  └─ thumbs-up.png
│     ├─ blocks
│     │  ├─ app-embed.liquid
│     │  ├─ delivery-time.liquid
│     │  └─ icon-with-text.liquid
│     ├─ favicon.ico
│     ├─ locales
│     │  └─ en.default.json
│     ├─ snippets
│     │  ├─ img-icon.liquid
│     │  └─ stars.liquid
│     └─ src
│        ├─ app.css
│        └─ app.js
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20240610101851_init
│  │  │  └─ migration.sql
│  │  ├─ 20240716232823_event
│  │  │  └─ migration.sql
│  │  ├─ 20240724102932_webhook
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seeds
│     ├─ channelSales.js
│     ├─ customers.js
│     ├─ fulfilledOrders.js
│     ├─ index.js
│     ├─ orders.js
│     ├─ returningCustomerRates.js
│     ├─ revenues.js
│     ├─ sales.js
│     ├─ sessions.js
│     └─ views.js
├─ public
│  └─ favicon.ico
├─ README.md
├─ remix.config.js
├─ tsconfig.json
├─ vite.config.js
└─ vite.extension.config.js

```