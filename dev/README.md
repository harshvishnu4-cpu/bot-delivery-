# Dev menu (testing only)

A hamburger button in the top-left corner that jumps straight to any screen of the game.

- **Open:** click the ☰ button. The screen you're on is highlighted and marked "current".
- **Jump:** click a screen. The page reloads and opens that screen (it presses Start and skips the story video for you).
- **Close:** click a screen, click anywhere outside the menu, or press Esc.

It works through the game's own save: jumping writes a save for the chosen screen, the same one "Resume Mission" uses.
So jumping replaces your saved progress. Rules you built earlier are kept; screens you skip use the game's defaults.

## Remove before release

1. Delete this `dev/` folder.
2. Delete the two lines marked `DEV MENU` in the `<head>` of `index.html`.

Nothing else in the game refers to it.
