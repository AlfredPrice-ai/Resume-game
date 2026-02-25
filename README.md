# 8-Bit Alfred — Interactive Resume Game

This project is a modern, modularized version of your playable resume. The single HTML file has been broken into structured components:
- `index.html`: Contains the layout and UI components (Start Screen, HUD, Modals, etc.)
- `style.css`: Contains all styling and animations for the game UI.
- `game.js`: Contains the core game loop, graphics rendering, collision logic, and facts.

## Next Steps Before Playing

Due to file size constraints, the base64-encoded character sprites could not be copied automatically into `game.js`.

**Action Required:**
1. Open your original `alfred_resume_game_v3 (1).html` file in a text editor (like Notepad or VS Code).
2. Scroll to **Line 149** and copy the entire `const SPRITES = { ... };` block (lines 149 through 162).
3. Open the new `game.js` file in your text editor.
4. Replace the empty `const SPRITES = {};` at the very top of `game.js` with the block you copied.
5. Save `game.js`.

You can now open `index.html` in your browser and play!

---

## 🚀 How to Host on GitHub Pages (Free)

To let anyone play this on the web (and from LinkedIn), the best approach is to host your game via GitHub Pages.

1. Create a GitHub Account (if you don't have one) at [github.com](https://github.com/).
2. Click **New Repository** (the `+` icon in the top right).
   - Name it something like `resume-game` or `alfred-resume`.
   - Make sure it is set to **Public**.
   - Click **Create repository**.
3. Upload your files:
   - On the next screen, click **"uploading an existing file"**.
   - Drag and drop `index.html`, `style.css`, and `game.js` into the box.
   - Click **Commit changes**.
4. Enable GitHub Pages:
   - Go to the **Settings** tab of your new repository.
   - Click **Pages** on the left sidebar.
   - Under "Build and deployment", set the **Source** to `Deploy from a branch`.
   - Under "Branch", select `main` (or `master`) and click **Save**.
5. After 1-2 minutes, refresh the page. At the top, you will see a link like:
   `Your site is live at https://[your-username].github.io/resume-game/`

**Copy this link! You will use it for LinkedIn.**

---

## 🔗 How to Add the Game to Your LinkedIn Profile

Since LinkedIn doesn't let you directly embed code, the cleanest and most professional way to share your game is in your **Featured** section using your new GitHub Pages link.

1. Go to your LinkedIn Profile.
2. Click the **Add profile section** button right below your profile picture.
3. Select **Recommended** -> **Add featured**.
4. In the Featured section, click the **`+`** icon, then choose **Add a link**.
5. Paste your GitHub Pages URL (e.g., `https://[your-username].github.io/resume-game/`) and hit **Add**.
6. **Customize the Preview:**
   - **Title:** "8-Bit Alfred: The Interactive Resume Adventure"
   - **Description:** "Take a break from reading standard resumes! Play my custom-built 8-bit platformer to learn about my career, skills, and impact."
   - *(Optional)* Add a screenshot of the game's start menu as the thumbnail image for maximum visual appeal.
7. Click **Save**.

Now, anyone visiting your LinkedIn profile will see a bold, clickable "card" right near the top that takes them directly into your interactive resume game!
