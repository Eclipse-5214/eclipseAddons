import {
  getRoomData,
  getRoomWorldData,
  getRealCoord,
  inDungeon,
  getRoomID,
} from "../utils/dutils";
import { drawBoxAtBlock } from "../utils/renderUtils";
import { drawString } from "../utils/utils";
import settings from "../utils/config";

/*  ------------- Secret Waypoints --------------

    Draws goofy waypoints at secrets

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//variables
var lastRoomId = null;
var currRoomData = null;
var secretsData = null;

//gets current room data
register("step", () => {
  if (settings().secretWaypoints) {
    let roomId = getRoomID();

    if (!roomId) {
      currRoomData = null;
      secretsData = null;
      return;
    }

    if (lastRoomId !== roomId) {
      lastRoomId = roomId;

      currRoomData = getRoomWorldData();
      secretsData = getRoomData();
    }
  }
}).setFps(5);

//desplays waypoints
register("renderWorld", () => {
  if (!inDungeon()) return;
  if (!settings().secretWaypoints) return;
  if (!secretsData) return;
  if (!secretsData.secret_coords) return;

  Object.entries(secretsData.secret_coords).forEach(([type, secrets]) => {
    secrets.forEach((pos) => {
      const secretPos = getRealCoord(pos, currRoomData);

      if (!secretPos) return;
      let [x, y, z] = secretPos;

      if (settings().showWText)
        drawString(
          type,
          x + 0.5,
          y + 1.5,
          z + 0.5,
          0xffffff,
          true,
          0.03,
          false
        );

      if (settings().boxWSecrets) {
        if (type == "chest") {
          let [r, g, b] = [
            settings().chestColor[0] / 255,
            settings().chestColor[1] / 255,
            settings().chestColor[2] / 255,
          ];
          drawBoxAtBlock(x + 0.0625, y, z + 0.0625, r, g, b, 0.875, 0.875);
        }
        if (type == "item") {
          let [r, g, b] = [
            settings().itemColor[0] / 255,
            settings().itemColor[1] / 255,
            settings().itemColor[2] / 255,
          ];
          drawBoxAtBlock(x + 0.25, y, z + 0.25, r, g, b, 0.5, 0.5);
        }
        if (type == "wither") {
          let [r, g, b] = [
            settings().witherColor[0] / 255,
            settings().witherColor[1] / 255,
            settings().witherColor[2] / 255,
          ];
          drawBoxAtBlock(x + 0.25, y, z + 0.25, r, g, b, 0.5, 0.5);
        }
        if (type == "bat") {
          let [r, g, b] = [
            settings().batColor[0] / 255,
            settings().batColor[1] / 255,
            settings().batColor[2] / 255,
          ];
          drawBoxAtBlock(x + 0.25, y + 0.25, z + 0.25, r, g, b, 0.5, 0.5);
        }
        if (type == "redstone_key") {
          let [r, g, b] = [
            settings().redstoneColor[0] / 255,
            settings().redstoneColor[1] / 255,
            settings().redstoneColor[2] / 255,
          ];
          drawBoxAtBlock(x + 0.25, y, z + 0.25, r, g, b, 0.5, 0.5);
        }
      }
    });
  });
});
