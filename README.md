# mansion-heist

## Adding New States:
When adding in new states, make sure to add the map to the Main.js file, and preload the tilemap into the preload.js file.

addMap(stateName, tilemapName, Array of Exit Objects)

Exit Object format:
{
  map: state to change to,
  direction: what part of the screen is the player leaving from,
  point: at what point (x if left or right, y if up or down) will the player transition,
  bound1: lower bound of exit location,
  bound2: upper bound of exit location,
  spawn: where in the next state is the player starting
}
