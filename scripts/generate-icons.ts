/**
 * Automated Icon Generation Script using Google Gemini API
 *
 * Usage:
 *   GEMINI_API_KEY=your_key npm run generate:icons
 *   GEMINI_API_KEY=your_key npm run generate:icons -- --category=resources
 *   GEMINI_API_KEY=your_key npm run generate:icons -- --dry-run
 *   GEMINI_API_KEY=your_key npm run generate:icons -- --model=gemini-2.0-flash-exp
 *
 * Environment variables:
 *   GEMINI_API_KEY - Your Google Gemini API key (required)
 *
 * Options:
 *   --category=<name>  Generate only a specific category (resources, buildings, ships, ui, icons)
 *   --dry-run          Parse prompts and show what would be generated without calling the API
 *   --skip-existing    Skip icons that already exist in the output directory
 *   --model=<name>     Gemini model to use (default: gemini-2.0-flash-exp)
 *
 * Note: Free tier has limited daily quota. If you hit rate limits, the script will
 * automatically retry with exponential backoff. For heavy usage, enable billing.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

interface IconPrompt {
  category: string;
  name: string;
  prompt: string;
  outputPath: string;
  dimensions: string;
}

// Mapping from section names to output directories and filename patterns
const CATEGORY_CONFIG: Record<
  string,
  { dir: string; prefix?: string; getFilename: (name: string) => string }
> = {
  "Resource Icons": {
    dir: "resources",
    getFilename: (name) => `${name.toLowerCase()}.png`,
  },
  "Building Icons": {
    dir: "buildings",
    getFilename: (name) =>
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") + ".png",
  },
  "Ship Sprites": {
    dir: "ships",
    getFilename: (name) =>
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") + ".png",
  },
  "UI Components": {
    dir: "ui",
    getFilename: (name) => {
      const mapping: Record<string, string> = {
        "Panel Background": "panel.png",
        "Primary Button - Normal": "btn-primary.png",
        "Primary Button - Hover": "btn-primary-hover.png",
        "Primary Button - Pressed": "btn-primary-pressed.png",
        "Primary Button - Disabled": "btn-primary-disabled.png",
        "Secondary Button - Normal": "btn-secondary.png",
        "Danger Button - Normal": "btn-danger.png",
        "Progress Bar - Empty": "progress-empty.png",
        "Progress Bar - Fill": "progress-fill.png",
        "Tab - Active": "tab-active.png",
        "Tab - Inactive": "tab-inactive.png",
        "Input Field": "input.png",
        "Tooltip Frame": "tooltip.png",
      };
      return (
        mapping[name] ||
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") + ".png"
      );
    },
  },
  "Navigation Icons": {
    dir: "icons",
    getFilename: (name) => {
      const mapping: Record<string, string> = {
        "Dashboard/Home": "nav-dashboard.png",
        Buildings: "nav-buildings.png",
        Research: "nav-research.png",
        Shipyard: "nav-shipyard.png",
        Fleet: "nav-fleet.png",
      };
      return (
        mapping[name] ||
        `nav-${name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}.png`
      );
    },
  },
  "Status Icons": {
    dir: "icons",
    getFilename: (name) => {
      const mapping: Record<string, string> = {
        "Timer/Clock": "status-timer.png",
        "Checkmark/Complete": "status-check.png",
        "Cancel/X": "status-cancel.png",
        Lock: "status-lock.png",
      };
      return (
        mapping[name] ||
        `status-${name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}.png`
      );
    },
  },
  "Optional Assets": {
    dir: "optional",
    getFilename: (name) =>
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") + ".png",
  },
};

// Category aliases for CLI
const CATEGORY_ALIASES: Record<string, string[]> = {
  resources: ["Resource Icons"],
  buildings: ["Building Icons"],
  ships: ["Ship Sprites"],
  ui: ["UI Components"],
  icons: ["Navigation Icons", "Status Icons"],
  nav: ["Navigation Icons"],
  status: ["Status Icons"],
  optional: ["Optional Assets"],
};

function parsePromptsFile(filePath: string): IconPrompt[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const prompts: IconPrompt[] = [];

  let currentCategory = "";
  let currentName = "";
  let inCodeBlock = false;
  let currentPrompt = "";

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect category headers (## N. Category Name) or (## N. Category Name (dimensions))
    const categoryMatch = line.match(/^## \d+\.\s+(.+)$/);
    if (categoryMatch) {
      // Strip dimensions suffix like "(32x32 pixels)"
      currentCategory = categoryMatch[1].trim().replace(/\s*\([^)]*\)\s*$/, "");
      continue;
    }

    // Detect item headers (### Item Name) or (### Item Name (dimensions))
    const itemMatch = line.match(/^### (.+)$/);
    if (itemMatch) {
      // Strip dimensions suffix like "(32x32 pixels)" or "(96x96, 9-slice)"
      currentName = itemMatch[1].trim().replace(/\s*\([^)]*\)\s*$/, "");
      continue;
    }

    // Handle code blocks
    if (line.trim() === "```") {
      if (inCodeBlock && currentPrompt && currentName && currentCategory) {
        const config = CATEGORY_CONFIG[currentCategory];
        if (config) {
          // Extract dimensions from the prompt
          const dimMatch = currentPrompt.match(/(\d+x\d+)\s*pixels?/i);
          const dimensions = dimMatch ? dimMatch[1] : "32x32";

          prompts.push({
            category: currentCategory,
            name: currentName,
            prompt: currentPrompt.trim(),
            outputPath: path.join(
              "public/sprites",
              config.dir,
              config.getFilename(currentName)
            ),
            dimensions,
          });
        } else {
          console.warn(`  Warning: Unknown category "${currentCategory}" for "${currentName}"`);
        }
        currentPrompt = "";
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    // Collect prompt content
    if (inCodeBlock) {
      currentPrompt += (currentPrompt ? "\n" : "") + line;
    }
  }

  return prompts;
}

// Default model - can be overridden with --model flag
const DEFAULT_MODEL = "gemini-2.0-flash-exp";
const MAX_RETRIES = 3;

async function generateImage(
  genAI: GoogleGenerativeAI,
  prompt: IconPrompt,
  modelName: string,
  retryCount = 0
): Promise<Buffer | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        // @ts-expect-error - responseModalities is valid for image generation
        responseModalities: ["image", "text"],
      },
    });

    const result = await model.generateContent(prompt.prompt);
    const response = result.response;

    // Extract image data from response
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        // @ts-expect-error - inlineData exists on image parts
        if (part.inlineData) {
          // @ts-expect-error - inlineData exists on image parts
          const imageData = part.inlineData.data;
          return Buffer.from(imageData, "base64");
        }
      }
    }

    console.error(`  No image data in response for ${prompt.name}`);
    return null;
  } catch (error: unknown) {
    const geminiError = error as { status?: number; errorDetails?: Array<{ retryDelay?: string }> };

    // Handle rate limiting with automatic retry
    if (geminiError.status === 429 && retryCount < MAX_RETRIES) {
      // Extract retry delay from error response
      let retryDelay = 60; // default 60 seconds
      if (geminiError.errorDetails) {
        for (const detail of geminiError.errorDetails) {
          if (detail.retryDelay) {
            const match = detail.retryDelay.match(/(\d+)/);
            if (match) {
              retryDelay = parseInt(match[1], 10) + 5; // Add 5s buffer
            }
          }
        }
      }

      console.log(`  ⏳ Rate limited. Waiting ${retryDelay}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
      await sleep(retryDelay * 1000);
      return generateImage(genAI, prompt, modelName, retryCount + 1);
    }

    // Check if it's a quota exhausted error (daily limit)
    if (geminiError.status === 429) {
      console.error(`  ❌ Daily quota exhausted. Try again tomorrow or enable billing.`);
    } else {
      console.error(`  Error generating ${prompt.name}:`, error);
    }
    return null;
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipExisting = args.includes("--skip-existing");

  // Parse model flag
  const modelArg = args.find((a) => a.startsWith("--model="));
  const modelName = modelArg ? modelArg.split("=")[1] : DEFAULT_MODEL;

  // Parse category filter
  let categoryFilter: string[] | null = null;
  const categoryArg = args.find((a) => a.startsWith("--category="));
  if (categoryArg) {
    const categoryName = categoryArg.split("=")[1].toLowerCase();
    categoryFilter = CATEGORY_ALIASES[categoryName] || [categoryName];
  }

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey && !dryRun) {
    console.error("Error: GEMINI_API_KEY environment variable is required");
    console.error("Usage: GEMINI_API_KEY=your_key npm run generate:icons");
    process.exit(1);
  }

  // Parse prompts
  const promptsFile = path.join(process.cwd(), "PIXEL_ART_PROMPTS.md");
  if (!fs.existsSync(promptsFile)) {
    console.error("Error: PIXEL_ART_PROMPTS.md not found in project root");
    process.exit(1);
  }

  console.log("Parsing prompts from PIXEL_ART_PROMPTS.md...\n");
  let prompts = parsePromptsFile(promptsFile);

  // Apply category filter
  if (categoryFilter) {
    prompts = prompts.filter((p) =>
      categoryFilter!.some(
        (cat) =>
          p.category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(p.category.toLowerCase())
      )
    );
  }

  // Group by category for display
  const byCategory = prompts.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {} as Record<string, IconPrompt[]>
  );

  console.log("Icons to generate:");
  console.log("==================");
  for (const [category, items] of Object.entries(byCategory)) {
    console.log(`\n${category} (${items.length} items):`);
    for (const item of items) {
      const exists = fs.existsSync(path.join(process.cwd(), item.outputPath));
      const status = exists ? " [EXISTS]" : "";
      console.log(`  - ${item.name} (${item.dimensions}) -> ${item.outputPath}${status}`);
    }
  }

  console.log(`\nTotal: ${prompts.length} icons`);

  if (dryRun) {
    console.log("\n--dry-run specified, exiting without generating images.");
    return;
  }

  // Filter out existing if requested
  if (skipExisting) {
    const before = prompts.length;
    prompts = prompts.filter(
      (p) => !fs.existsSync(path.join(process.cwd(), p.outputPath))
    );
    console.log(`\nSkipping ${before - prompts.length} existing icons.`);
  }

  if (prompts.length === 0) {
    console.log("\nNo icons to generate.");
    return;
  }

  console.log(`\nGenerating ${prompts.length} icons using model: ${modelName}...\n`);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(apiKey!);

  // Create output directories
  const dirs = new Set(prompts.map((p) => path.dirname(p.outputPath)));
  for (const dir of dirs) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }

  // Generate images
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const progress = `[${i + 1}/${prompts.length}]`;

    console.log(`${progress} Generating ${prompt.name}...`);

    const imageBuffer = await generateImage(genAI, prompt, modelName);

    if (imageBuffer) {
      const outputPath = path.join(process.cwd(), prompt.outputPath);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✓ Saved to ${prompt.outputPath}`);
      successful++;
    } else {
      console.log(`  ✗ Failed to generate`);
      failed++;
    }

    // Rate limiting: wait between requests to avoid hitting API limits
    if (i < prompts.length - 1) {
      await sleep(2000); // 2 second delay between requests
    }
  }

  console.log("\n==================");
  console.log(`Generation complete!`);
  console.log(`  Successful: ${successful}`);
  console.log(`  Failed: ${failed}`);
}

main().catch(console.error);
