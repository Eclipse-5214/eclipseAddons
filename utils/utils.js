const MCTessellator = net.minecraft.client.renderer.Tessellator.func_178181_a();
const DefaultVertexFormats = net.minecraft.client.renderer.vertex.DefaultVertexFormats;
const WorldRenderer = MCTessellator.func_178180_c();
const EnumParticleTypes = Java.type("net.minecraft.util.EnumParticleTypes");

/*  ------------- General Utilities -------------

    General skyblok utilities

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

/**
 * - Chattrigger's Tessellator.drawString() with depth check and multiline and shadow
 * - Renders floating lines of text in the 3D world at a specific position.
 *
 * @param {String} text The text to render
 * @param {Number} x X coordinate in the game world
 * @param {Number} y Y coordinate in the game world
 * @param {Number} z Z coordinate in the game world
 * @param {Number} color the color of the text
 * @param {Boolean} renderBlackBox
 * @param {Number} scale the scale of the text
 * @param {Boolean} increase whether to scale the text up as the player moves away
 * @param {Boolean} shadow whether to render shadow
 * @param {Boolean} depth whether to render through walls
 */
export function drawString(text, x, y, z, color = 0xffffff, renderBlackBox = true, scale = 1, increase = true, shadow = true, depth = true) {
    ({ x, y, z } = Tessellator.getRenderPos(x, y, z));

    const lText = text.addColor();

    const lScale = increase
        ? scale * 0.45 * (Math.sqrt(x ** 2 + y ** 2 + z ** 2) / 120) //increase up to 120 blocks away
        : scale;
    const xMulti = Client.getMinecraft().field_71474_y.field_74320_O == 2 ? -1 : 1; //perspective

    GlStateManager.func_179131_c(1, 1, 1, 0.5); // color
    GlStateManager.func_179094_E(); // pushmatrix

    GlStateManager.func_179137_b(x, y, z); // translate
    GlStateManager.func_179114_b(-Renderer.getRenderManager().field_78735_i, 0, 1, 0); // rotate
    GlStateManager.func_179114_b(Renderer.getRenderManager().field_78732_j * xMulti, 1, 0, 0); // rotate

    GlStateManager.func_179152_a(-lScale, -lScale, lScale); // scale
    GlStateManager.func_179140_f(); //disableLighting
    GlStateManager.func_179132_a(false); //depthMask

    if (depth) GlStateManager.func_179097_i(); // disableDepth

    GlStateManager.func_179147_l(); // enableBlend
    GlStateManager.func_179112_b(770, 771); // blendFunc

    const lines = lText.split("\n");
    const l = lines.length;
    const maxWidth = Math.max(...lines.map((it) => Renderer.getStringWidth(it))) / 2;

    if (renderBlackBox) {
        GlStateManager.func_179090_x(); //disableTexture2D
        WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181706_f); // begin
        WorldRenderer.func_181662_b(-maxWidth - 1, -1 * l, 0)
            .func_181666_a(0, 0, 0, 0.25)
            .func_181675_d(); // pos, color, endvertex
        WorldRenderer.func_181662_b(-maxWidth - 1, 9 * l, 0)
            .func_181666_a(0, 0, 0, 0.25)
            .func_181675_d(); // pos, color, endvertex
        WorldRenderer.func_181662_b(maxWidth + 1, 9 * l, 0)
            .func_181666_a(0, 0, 0, 0.25)
            .func_181675_d(); // pos, color, endvertex
        WorldRenderer.func_181662_b(maxWidth + 1, -1 * l, 0)
            .func_181666_a(0, 0, 0, 0.25)
            .func_181675_d(); // pos, color, endvertex
        MCTessellator.func_78381_a(); // draw
        GlStateManager.func_179098_w(); // enableTexture2D
    }

    lines.forEach((it, idx) => {
        Renderer.getFontRenderer().func_175065_a(it, -Renderer.getStringWidth(it) / 2, idx * 9, color, shadow); // drawString
    });

    GlStateManager.func_179131_c(1, 1, 1, 1); // color
    GlStateManager.func_179132_a(true); // depthMask
    GlStateManager.func_179126_j(); // enableDepth
    GlStateManager.func_179121_F(); // popMatrix
}

//calculates the distance between 2 points using the 3d distance formula
export const calcDistance = (p1, p2) => {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let dist = a * a + b * b + c * c;

    if (dist < 0) {
        dist *= -1;
    }
    return dist;
};

//self explanitory
export function spawnParticleAtLocation(loc, velo, particle) {
    let particleType = EnumParticleTypes.valueOf(particle);
    let idField = particleType.getClass().getDeclaredField("field_179372_R");
    idField.setAccessible(true);
    let id = idField.get(particleType);

    Client.getMinecraft().field_71438_f.func_174974_b(
        id, // particleID
        true, // shouldIgnoreRange
        loc[0], // x
        loc[1], // y
        loc[2], // z
        velo[0], // speedX
        velo[1], // speedY
        velo[2] // speedZ
    );
}

//draws a linne of particles
export function drawLineParticles(loc1, loc2) {
    let distance = Math.hypot(...loc1.map((a, i) => a - loc2[i]));
    let maxPoints = Math.ceil(distance * 1);
    for (let i = 0; i < maxPoints; i++) {
        let actualI = i + Math.random();
        let a = actualI / maxPoints;
        let loc = [loc1[0] * a + loc2[0] * (1 - a) - 0.5, loc1[1] * a + loc2[1] * (1 - a) + 0.1, loc1[2] * a + loc2[2] * (1 - a) - 0.5];

        let a2 = (actualI + 0.02) / maxPoints;
        let loc3 = [loc1[0] * a2 + loc2[0] * (1 - a2) - 0.5, loc1[1] * a2 + loc2[1] * (1 - a2) + 0.1, loc1[2] * a2 + loc2[2] * (1 - a2) - 0.5];
        loc3 = loc3.map((a, i) => loc[i] - a);

        spawnParticleAtLocation(loc, loc3, "FLAME");
    }
}
