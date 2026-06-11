# Alliance Duel Manager

Alliance Duel Manager is a web application designed to help alliance leaders and officers track member performance, manage participation records, and analyze long-term alliance duel statistics.

---

## Features

### Member Management

Manage alliance members with support for:

- Adding new members - Tracking member nicknames - Storing member timezones - Temporarily removing members from the alliance - Rejoining previously removed members - Preserving historical data without permanently deleting members

This ensures that member performance history remains intact even if a player leaves and later returns.

---

## Alliance Duel Tracking

The Alliance Duel tab provides an easy way to record daily duel results.

### Entry Management

For each member and day, users can:

- Enter score totals - Mark entries as: - Top Entry - General Entry - Bottom Entry - Mark members as exempt for the week - View and edit entries through a calendar-based interface - Use quick selection tools located at the bottom of the page

This allows alliance leadership to efficiently maintain accurate duel records throughout the week.

---

## Rankings

The Rankings section provides multiple ways to analyze alliance performance.

### Weekly Rankings

View alliance performance one week at a time.

Each week includes:

#### Statistics

- Top 10 Count - Repeat Failures Count - Top 10 By Day - Below Requirement By Day

#### Special Notes

Automatically generated notes summarizing notable appearances and performance highlights throughout the week.

#### Weekly Summary

A ready-to-copy summary divided into:

##### Positive Highlights

Examples:

- Top 10 appearances - Strong improvements - Consistent participation

##### Areas for Improvement

Examples:

- Missed requirements - Repeat failures - Low-scoring entries

The summary is designed to be copied directly into alliance chat or external communication tools.

---

### All-Time Rankings

Provides historical performance statistics across all recorded weeks.

#### Includes

- Top 10 counts for all time - Below requirement counts - Daily performance records - Top 100 scores by day - Bottom 100 scores by day

This allows leaders to identify long-term trends and standout performances.

---

### Member Statistics

View detailed information for individual members.

#### Member Statistics Includes

- Daily performance summaries - Historical performance statistics - Weekly entry logs - Individual participation history

This section helps track member consistency and long-term contributions to the alliance.

---

## Timezone Groups

The Groups tab helps alliances coordinate across multiple regions.

### Timezone Groups Features

- Organizes members by timezone - Displays timezone-based member groups - Visual timeline showing overlap between alliance members - Helps identify active periods across the alliance - Create Groups to allow members to have more interations with each other.

This makes it easier to plan alliance activities and understand how game schedules align with member availability.

---

## Benefits

Alliance Duel Manager helps alliance leadership:

- Track participation accurately - Monitor member performance - Identify top performers - Detect repeat failures - Generate weekly reports quickly - Analyze long-term alliance trends - Coordinate members across timezones

---

## Data Preservation

Historical records are preserved even when members leave the alliance.

Removed members can be reactivated later without losing:

- Duel history - Rankings - Statistics - Weekly records

This ensures accurate long-term tracking for all alliance members.

---

## Google Apps Script Integration (clasp)

This project uses Google's **clasp** CLI to synchronize Apps Script files with the remote Google Apps Script project.

### Prerequisites

Install clasp as a development dependency:

```bash
npm install --save-dev @google/clasp
```

### Authenticate

Log in to your Google account:

```bash
npx clasp login
```

### Configure Project

Utilize the provided clasp.json file in the root directory.

Replace `YOUR_SCRIPT_ID` with the Apps Script project's Script ID.

The Apps Script source files are stored in:

```text
public/
└── appscripts/
    ├── Code.gs
    ├── appsscript.json
    └── ...
```

### Available Commands

Pull the latest Apps Script code from Google:

```bash
npm run pull
```

Push local changes to Google Apps Script:

```bash
npm run push
```

### First-Time Setup

If the local Apps Script you made are not currently in public/appscripts:

```bash
npx clasp clone YOUR_SCRIPT_ID
```

After cloning, move the generated files into `public/appscripts` or configure the `rootDir` before pulling.

### Verify Connection

To confirm that clasp is connected to the correct Apps Script project:

```bash
npx clasp status
```

#### Git ignore clasp

Run the following command to have Git ignore any changes made to .clasp.json:

```bash
git update-index --skip-worktree .clasp.json
```

If configured correctly, clasp will display the tracked Apps Script files and their sync status.

## Environment Configuration

This application uses environment variables for API routing and authentication.

### Create a `.env` File

Create a `.env` file in the project root:

```env
VITE_REACT_APP_API_URL
VITE_APP_PASSWORD
```

### Configure the Apps Script URL

The application proxies requests to a Google Apps Script deployment.
If using the included proxy route, update the Apps Script URL in the proxy configuration as needed, given upon a deployment in App Scripts.:

### Environment Variables

| Variable                 | Description                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `VITE_REACT_APP_API_URL` | Base URL used by the frontend for API requests. Defaults to the local proxy endpoint. |
| `VITE_APP_PASSWORD`      | Application password used for protected operations.                                   |
| `APPS_SCRIPT_URL`        | Google Apps Script Web App endpoint used by the proxy server.                         |

### Security Notes

- For production deployments, configure environment variables through your hosting provider's secret management system.
- If the Apps Script deployment URL changes, update the proxy configuration and redeploy the application.

```bash
npm run dev
```
