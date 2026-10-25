// Dibujos compartidos por la pantalla grande (index.html) y la imagen de recuerdo del celular (control.html):
// el cielo con la Vía Láctea, El Arco de Cabo San Lucas y la ballena jorobada. Si se cambian aquí, cambian en los dos.

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const len = (x, y) => Math.sqrt(x * x + y * y);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

// ================= Forma del corazón =================
export const heartX = (t) => 16 * Math.pow(Math.sin(t), 3);
// El -2.5 centra el corazón: la punta baja más de lo que suben los lóbulos
export const heartY = (t) => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.5;

// ================= Cielo =================
// Cielo de noche completo (fondo, Vía Láctea, brillo del horizonte y estrellas) en un lienzo de W × H.
// "bottom" es donde termina el cielo (el horizonte si hay mar). Se pinta una sola vez: es lo pesado
export function paintSky(s, W, H, bottom = H) {
    // Fondo: azul noche, casi negro arriba, que se vuelve apenas morado hacia el horizonte
    const base = s.createLinearGradient(0, 0, 0, bottom);
    base.addColorStop(0, '#03061a'); base.addColorStop(0.6, '#060a24'); base.addColorStop(1, '#120e2e');
    s.fillStyle = base; s.fillRect(0, 0, W, H);
    paintMilkyWay(s, W, H, bottom);
    // Brillo leve violeta-rosa sobre el horizonte, como en las fotos de cielo del desierto
    const glow = s.createLinearGradient(0, bottom - H * 0.3, 0, bottom);
    glow.addColorStop(0, 'rgba(110, 60, 150, 0)'); glow.addColorStop(0.7, 'rgba(120, 62, 150, 0.12)'); glow.addColorStop(1, 'rgba(150, 70, 160, 0.26)');
    s.fillStyle = glow; s.fillRect(0, bottom - H * 0.3, W, H * 0.3);
    // Estrellas de todo el cielo
    const count = Math.max(900, Math.round(900 * (W * H) / (1920 * 1080)));
    for (let i = 0; i < count; i++) {
        s.fillStyle = `rgba(${Math.round(rand(210, 255))}, ${Math.round(rand(220, 255))}, 255, ${rand(0.08, 0.45).toFixed(2)})`;
        const r = Math.random() < 0.05 ? rand(1, 1.6) : rand(0.3, 0.9);
        s.beginPath(); s.arc(rand(0, W), rand(0, bottom), r, 0, Math.PI * 2); s.fill();
    }
}

// Vía Láctea al estilo de una foto real: una nube azul pálida, curva y de ancho irregular, con racimos de estrellas
// y manchas de polvo oscuro. Es tenue a propósito, para que el corazón y los cometas sigan siendo lo que resalta
function paintMilkyWay(s, W, H, bottom) {
    const m = Math.min(W, H);
    const ph = Array.from({ length: 5 }, () => rand(0, Math.PI * 2));
    // Su eje: una curva suave que sube desde abajo a la izquierda hacia arriba a la derecha
    const p0 = [W * rand(0.02, 0.1), bottom * 1.05], p1 = [W * rand(0.16, 0.26), bottom * 0.4], p2 = [W * rand(0.74, 0.86), -H * 0.05];
    const along = (t) => {
        const u = 1 - t;
        const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
        const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
        const d = len(dx, dy) || 1;
        // Ancho que cambia a lo largo y un vaivén del centro: así no se ve como una línea
        const width = m * 0.15 * (0.75 + 0.25 * Math.sin(t * 7 + ph[0]) + 0.15 * Math.sin(t * 13 + ph[1]));
        const wander = m * 0.035 * Math.sin(t * 5 + ph[2]);
        return { x: x - (dy / d) * wander, y: y + (dx / d) * wander, nx: -dy / d, ny: dx / d, width };
    };
    const blob = (x, y, r, rgb, a) => {
        const g = s.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${rgb}, ${a.toFixed(3)})`); g.addColorStop(1, `rgba(${rgb}, 0)`);
        s.fillStyle = g; s.fillRect(x - r, y - r, r * 2, r * 2);
    };
    // 0) Neblina muy tenue repartida por todo el cielo, para que no sea una sola franja
    for (let i = 0; i < 26; i++) {
        const x = rand(0, W), y = rand(0, bottom * 0.95);
        blob(x, y, rand(0.15, 0.32) * m, pick(['90, 120, 210', '120, 100, 200', '80, 140, 200']), rand(0.012, 0.024));
    }
    // 1) Resplandor difuso azul pálido
    for (let i = 0; i < 240; i++) {
        const t = Math.random(); const a = along(t); const o = gauss() * a.width * 0.8;
        blob(a.x + a.nx * o, a.y + a.ny * o, rand(0.05, 0.12) * m, '115, 145, 225', rand(0.014, 0.026));
    }
    // Un segundo brazo más tenue que se separa del principal, como en las fotos reales
    for (let i = 0; i < 90; i++) {
        const t = rand(0.12, 0.62); const a = along(t); const o = a.width * (0.7 + (t - 0.12) * 1.4) + gauss() * a.width * 0.35;
        blob(a.x + a.nx * o, a.y + a.ny * o, rand(0.04, 0.09) * m, '115, 145, 225', rand(0.01, 0.018));
    }
    // 2) Racimos de estrellas: nubecitas claras y pequeñas, agrupadas, que le dan textura
    for (let c = 0; c < 70; c++) {
        const t = Math.random(); const a = along(t); const o = gauss() * a.width * 0.6;
        const cx = a.x + a.nx * o, cy = a.y + a.ny * o;
        for (let i = 0; i < 18; i++) blob(cx + gauss() * m * 0.04, cy + gauss() * m * 0.04, rand(0.006, 0.022) * m, '185, 205, 255', rand(0.02, 0.038));
    }
    // 3) Toques de color: algo de lavanda abajo y un poco de turquesa arriba
    for (let i = 0; i < 50; i++) { const a = along(rand(0, 0.45)); const o = gauss() * a.width * 0.7; blob(a.x + a.nx * o, a.y + a.ny * o, rand(0.03, 0.07) * m, '150, 120, 215', rand(0.015, 0.025)); }
    for (let i = 0; i < 30; i++) { const a = along(rand(0.5, 1)); const o = gauss() * a.width * 0.7; blob(a.x + a.nx * o, a.y + a.ny * o, rand(0.03, 0.06) * m, '110, 185, 225', rand(0.012, 0.02)); }
    // 4) Polvo oscuro suave y en manchas sueltas (no en línea), que da la textura de la galaxia
    for (let i = 0; i < 170; i++) {
        const t = rand(0.08, 0.9);
        if (Math.sin(t * 14 + ph[3]) > 0.25) continue;
        const a = along(t); const o = a.width * 0.3 * Math.sin(t * 6 + ph[4]) + gauss() * a.width * 0.35;
        blob(a.x + a.nx * o, a.y + a.ny * o, rand(0.015, 0.05) * m, '3, 5, 18', rand(0.1, 0.22));
    }
    for (let i = 0; i < 110; i++) {
        const a = along(Math.random()); const o = gauss() * a.width * 0.8;
        blob(a.x + a.nx * o, a.y + a.ny * o, rand(0.02, 0.06) * m, '3, 5, 18', rand(0.06, 0.13));
    }
    // 5) Muchas estrellitas, más juntas en la galaxia
    for (let i = 0; i < 3400; i++) {
        const a = along(Math.random()); const o = gauss() * a.width;
        const x = a.x + a.nx * o, y = a.y + a.ny * o;
        if (y > bottom) continue;
        s.fillStyle = `rgba(${Math.round(rand(200, 240))}, ${Math.round(rand(215, 245))}, 255, ${rand(0.12, 0.6).toFixed(2)})`;
        const r = Math.random() < 0.04 ? rand(0.9, 1.4) : rand(0.3, 0.75);
        s.fillRect(x, y, r, r);
    }
}

// ================= El Arco de Cabo San Lucas =================
// Silueta de El Arco y Los Frailes calcada de una foto real (Land's End al atardecer, Wikimedia Commons).
// Son coordenadas de la foto: el nivel del mar está en y = 668. El hueco del arco está al final (abre al nivel del agua)
const ARCO = [[225,668],[240,640],[255,600],[265,560],[272,520],[280,495],[290,487],[300,490],[305,510],[318,520],[330,540],[342,570],[350,600],[360,630],[375,650],
    [383,640],[385,600],[383,550],[385,500],[382,460],[388,420],[398,395],[420,385],[448,372],[468,370],[480,382],[500,400],[520,410],[540,430],[548,445],[560,460],[575,490],[590,520],[605,560],[620,600],[635,630],[650,668],
    [728,668],[745,660],[762,650],[762,620],[765,580],[770,550],[785,530],[790,505],[800,490],[812,480],[825,478],[838,485],[845,500],[848,520],[860,525],[880,520],[900,505],[915,480],[930,460],[950,440],[970,410],[990,380],[1010,345],[1030,315],[1045,295],[1055,282],[1070,278],[1085,285],[1090,300],[1100,290],[1120,265],[1140,248],[1160,243],[1200,250],[1240,265],[1270,280],[1270,668],
    [928,668],[926,640],[918,620],[905,605],[890,598],[872,598],[855,605],[842,620],[835,640],[833,668]];
export const ARCO_BOX = { x0: 225, w: 1045, top: 243, sea: 668 };

// Pinta la silueta con escala k, empezando en (ox, oy) (esquina de arriba a la izquierda); h es su alto en pantalla
export function paintArco(a, k, ox = 2, oy = 2, h = (ARCO_BOX.sea - ARCO_BOX.top) * k) {
    a.beginPath();
    ARCO.forEach(([x, y], i) => { const px = ox + (x - ARCO_BOX.x0) * k, py = oy + (y - ARCO_BOX.top) * k; i ? a.lineTo(px, py) : a.moveTo(px, py); });
    a.closePath();
    const rock = a.createLinearGradient(0, oy, 0, oy + h);
    rock.addColorStop(0, '#0d0c22'); rock.addColorStop(1, '#04040d');
    a.fillStyle = rock; a.fill();
    // Un borde apenas iluminado, como luz de luna, para que la silueta se lea de noche
    a.lineJoin = 'round';
    a.strokeStyle = 'rgba(150, 150, 210, 0.22)'; a.lineWidth = 1.2; a.stroke();
}

// ================= Ballena jorobada =================
// Vista de lado (mirando a la derecha): cabeza plana con protuberancias, mandíbula con pliegues,
// la aleta pectoral larguísima (la seña de las jorobadas), una aleta dorsal pequeña sobre una joroba y la cola horizontal
const WHALE_BODY = new Path2D('M165,2 C163,-8 150,-16 128,-20 C100,-27 60,-35 15,-36 C-20,-36 -45,-32 -62,-30 C-68,-34 -72,-40 -76,-42 C-80,-36 -86,-30 -96,-26 C-118,-18 -142,-8 -170,-3 L-170,3 C-140,8 -110,20 -70,30 C-30,40 20,44 70,39 C105,35 140,26 158,15 C163,11 166,6 165,2 Z');
const WHALE_FIN = new Path2D('M84,22 C74,44 44,66 -10,76 C2,66 40,48 66,28 Z');
const WHALE_FLUKE = new Path2D('M0,0 C-10,-5 -30,-12 -62,-13 C-54,-8 -48,-4 -44,-1 C-50,3 -60,8 -70,14 C-40,12 -16,6 0,0 Z');
const WHALE_GROOVES = new Path2D('M165,4 C140,9 115,9 92,7 M104,32 C125,28 145,21 158,14 M100,36 C122,33 143,26 160,17 M96,40 C118,38 140,31 156,23');
const WHALE_KNOBS = [[150, -13], [139, -16], [128, -19], [117, -21]];

// flip = 1 mira a la derecha, -1 a la izquierda (en medio se ve dando la vuelta); phase mueve la cola y la aleta
export function drawWhale(ctx, x, y, size, flip, phase, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size * flip, size);
    const px = 1 / size;
    ctx.globalAlpha = alpha;
    // Cola: sube y baja al nadar
    ctx.save(); ctx.translate(-168, 0); ctx.rotate(Math.sin(phase) * 0.2);
    ctx.fillStyle = 'rgba(120, 160, 215, 0.2)'; ctx.fill(WHALE_FLUKE);
    ctx.strokeStyle = 'rgba(205, 228, 255, 0.5)'; ctx.lineWidth = 1.3 * px; ctx.stroke(WHALE_FLUKE);
    ctx.restore();
    // Cuerpo, con un halo suave (dos trazos: uno ancho y tenue, otro fino)
    ctx.fillStyle = 'rgba(120, 160, 215, 0.2)'; ctx.fill(WHALE_BODY);
    ctx.strokeStyle = 'rgba(170, 205, 255, 0.07)'; ctx.lineWidth = 7 * px; ctx.stroke(WHALE_BODY);
    ctx.strokeStyle = 'rgba(205, 228, 255, 0.55)'; ctx.lineWidth = 1.4 * px; ctx.stroke(WHALE_BODY);
    ctx.strokeStyle = 'rgba(205, 228, 255, 0.25)'; ctx.lineWidth = 1 * px; ctx.stroke(WHALE_GROOVES);
    // Protuberancias de la cabeza y el ojo
    ctx.fillStyle = 'rgba(225, 240, 255, 0.85)';
    for (const [kx, ky] of WHALE_KNOBS) { ctx.beginPath(); ctx.arc(kx, ky, 1.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.beginPath(); ctx.arc(98, 4, 2.4, 0, Math.PI * 2); ctx.fill();
    // Aleta pectoral blanca y muy larga, con un vaivén lento
    ctx.save(); ctx.translate(84, 22); ctx.rotate(Math.sin(phase * 0.5 + 1) * 0.1); ctx.translate(-84, -22);
    ctx.fillStyle = 'rgba(200, 225, 255, 0.32)'; ctx.fill(WHALE_FIN);
    ctx.strokeStyle = 'rgba(225, 240, 255, 0.65)'; ctx.lineWidth = 1.2 * px; ctx.stroke(WHALE_FIN);
    ctx.restore();
    ctx.restore();
}
