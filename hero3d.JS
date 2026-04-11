(function () {
  var wrap = document.getElementById('heroVisual3D');
  if (!wrap || typeof THREE === 'undefined') return;

  var canvas = document.getElementById('hero3d-canvas');
  var W = wrap.clientWidth || 520;
  var H = wrap.clientHeight || 480;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
  camera.position.set(0, 0.8, 5.2);
  camera.lookAt(0, 0, 0);

  var gold = new THREE.Color(0xd4af37);
  var goldLight = new THREE.Color(0xffe87a);

  scene.add(new THREE.AmbientLight(0x111111, 1.5));

  var pl1 = new THREE.PointLight(0xd4af37, 4, 10);
  pl1.position.set(3, 3, 3);
  scene.add(pl1);

  var pl2 = new THREE.PointLight(0x3355cc, 2, 8);
  pl2.position.set(-3, -2, 2);
  scene.add(pl2);

  var pl3 = new THREE.PointLight(0xd4af37, 1.5, 7);
  pl3.position.set(0, 4, -2);
  scene.add(pl3);

  var centerGroup = new THREE.Group();
  scene.add(centerGroup);

  /* ── KART ── */
  var cardMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c16,
    metalness: 0.75,
    roughness: 0.25
  });
  var cardMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 0.09, 1, 1, 1), cardMat);
  centerGroup.add(cardMesh);

  /* Altın çerçeve */
  var frameMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.1,
    emissive: new THREE.Color(0xd4af37),
    emissiveIntensity: 0.1
  });
  var frameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.04, 1.54, 0.05), frameMat);
  frameMesh.position.z = -0.025;
  centerGroup.add(frameMesh);

  /* İç panel */
  var panelMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a10,
    metalness: 0.5,
    roughness: 0.4
  });
  var panelMesh = new THREE.Mesh(new THREE.BoxGeometry(1.88, 1.38, 0.02), panelMat);
  panelMesh.position.z = 0.046;
  centerGroup.add(panelMesh);

  /* ── ŞIMŞEK BOLT (extrude) ── */
  var boltShape = new THREE.Shape();
  boltShape.moveTo(0.045, 0.25);
  boltShape.lineTo(-0.045, 0.05);
  boltShape.lineTo(0.018, 0.05);
  boltShape.lineTo(-0.045, -0.25);
  boltShape.lineTo(0.045, -0.05);
  boltShape.lineTo(-0.018, -0.05);
  boltShape.closePath();

  var boltGeo = new THREE.ExtrudeGeometry(boltShape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelSize: 0.007,
    bevelThickness: 0.007,
    bevelSegments: 3
  });
  var boltMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 1,
    roughness: 0.05,
    emissive: new THREE.Color(0xffe87a),
    emissiveIntensity: 0.8
  });
  var boltMesh = new THREE.Mesh(boltGeo, boltMat);
  boltMesh.position.set(0, 0.14, 0.07);
  centerGroup.add(boltMesh);

  /* ── HALKALAR (Torus) ── */
  function makeRing(radius, tube, color, emInt, rotX, rotZ) {
    var mat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.95,
      roughness: 0.1,
      emissive: new THREE.Color(color),
      emissiveIntensity: emInt
    });
    var mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 20, 140), mat);
    mesh.rotation.x = rotX;
    mesh.rotation.z = rotZ;
    return mesh;
  }

  var ring1 = makeRing(1.25, 0.010, 0xd4af37, 0.35, Math.PI * 0.15, Math.PI * 0.05);
  var ring2 = makeRing(1.55, 0.007, 0xd4af37, 0.18, -Math.PI * 0.20, Math.PI * 0.10);
  var ring3 = makeRing(0.95, 0.006, 0x886600, 0.12, Math.PI * 0.50, Math.PI * 0.15);
  var ring4 = makeRing(1.80, 0.004, 0xc8a020, 0.08, Math.PI * 0.08, -Math.PI * 0.12);
  centerGroup.add(ring1);
  centerGroup.add(ring2);
  centerGroup.add(ring3);
  centerGroup.add(ring4);

  /* ── ORBİT PARTİKÜLLERİ ── */
  function makeParticle(radius, color, size, tiltX, tiltZ) {
    var geo = new THREE.SphereGeometry(size, 10, 10);
    var mat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: new THREE.Color(color),
      emissiveIntensity: 3,
      metalness: 1,
      roughness: 0
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(radius, 0, 0);
    var pivot = new THREE.Group();
    pivot.rotation.x = tiltX;
    pivot.rotation.z = tiltZ;
    pivot.add(mesh);
    return { pivot: pivot, mesh: mesh };
  }

  var p1 = makeParticle(1.25, 0xffe87a, 0.045, Math.PI * 0.15, Math.PI * 0.05);
  var p2 = makeParticle(1.55, 0xfff0a0, 0.035, -Math.PI * 0.20, Math.PI * 0.10);
  var p3 = makeParticle(0.95, 0xd4af37, 0.030, Math.PI * 0.50, Math.PI * 0.15);
  var p4 = makeParticle(1.80, 0xc8a020, 0.022, Math.PI * 0.08, -Math.PI * 0.12);
  centerGroup.add(p1.pivot);
  centerGroup.add(p2.pivot);
  centerGroup.add(p3.pivot);
  centerGroup.add(p4.pivot);

  /* ── İZ (trail) çizgileri ── */
  function makeTrail(radius, tiltX, tiltZ, color, segments) {
    var pts = [];
    for (var i = 0; i <= segments; i++) {
      var a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    var geo = new THREE.BufferGeometry().setFromPoints(pts);
    var colors = [];
    for (var j = 0; j <= segments; j++) {
      var t = j / segments;
      var alpha = t < 0.18 ? t / 0.18 : t > 0.82 ? (1 - t) / 0.18 : 1;
      var c = new THREE.Color(color);
      colors.push(c.r * alpha, c.g * alpha, c.b * alpha);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    var mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 });
    var line = new THREE.Line(geo, mat);
    var pivot = new THREE.Group();
    pivot.rotation.x = tiltX;
    pivot.rotation.z = tiltZ;
    pivot.add(line);
    return pivot;
  }

  var tr1 = makeTrail(1.25, Math.PI * 0.15, Math.PI * 0.05, 0xd4af37, 100);
  var tr2 = makeTrail(1.55, -Math.PI * 0.20, Math.PI * 0.10, 0xfff0a0, 120);
  var tr3 = makeTrail(0.95, Math.PI * 0.50, Math.PI * 0.15, 0xd4af37, 80);
  var tr4 = makeTrail(1.80, Math.PI * 0.08, -Math.PI * 0.12, 0xc8a020, 140);
  centerGroup.add(tr1);
  centerGroup.add(tr2);
  centerGroup.add(tr3);
  centerGroup.add(tr4);

  /* ── ŞIMŞEK SPARK'LARI ── */
  function makeSpark(color) {
    var pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    var geo = new THREE.BufferGeometry().setFromPoints(pts);
    var mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0 });
    return new THREE.Line(geo, mat);
  }

  var sparkData = [];
  var sparkColors = [0xffe87a, 0xffffff, 0xfff0a0, 0xd4af37, 0xffffff, 0xffe87a];
  for (var si = 0; si < 6; si++) {
    var sp = makeSpark(sparkColors[si]);
    centerGroup.add(sp);
    sparkData.push({ line: sp, life: 0, maxLife: 0.2 + Math.random() * 0.25, next: Math.random() * 1.5 });
  }

  /* Merkez parlama ışığı */
  var glowPL = new THREE.PointLight(0xd4af37, 5, 4);
  glowPL.position.set(0, 0, 0.6);
  centerGroup.add(glowPL);

  /* ── YILDIZLAR ── */
  var starCount = 160;
  var starPositions = new Float32Array(starCount * 3);
  for (var i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 18;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xfff8e0, size: 0.025, transparent: true, opacity: 0.45 })));

  /* ── MOBİL PERFORMANS ── */
  var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  if (isMobile) { renderer.setPixelRatio(1); }

  /* ── MOUSE & TOUCH TAKİBİ ── */
  var mouse = { x: 0, y: 0 };
  var targetRot = { x: 0, y: 0 };

  wrap.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
  });

  wrap.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var r = canvas.getBoundingClientRect();
    var t = e.touches[0];
    mouse.x = ((t.clientX - r.left) / r.width - 0.5) * 2;
    mouse.y = -((t.clientY - r.top) / r.height - 0.5) * 2;
  }, { passive: false });

  wrap.addEventListener('touchend', function () {
    mouse.x = 0; mouse.y = 0;
  });

  /* ── ANİMASYON ── */
  var clock = new THREE.Clock();
  var elapsed = 0;

  function animate() {
    requestAnimationFrame(animate);
    var dt = clock.getDelta();
    elapsed += dt;

    targetRot.y += (mouse.x * 0.45 - targetRot.y) * 0.05;
    targetRot.x += (mouse.y * 0.28 - targetRot.x) * 0.05;

    centerGroup.rotation.y = targetRot.y + elapsed * 0.13;
    centerGroup.rotation.x = targetRot.x + Math.sin(elapsed * 0.38) * 0.04;

    p1.pivot.rotation.z = elapsed * 1.5;
    p2.pivot.rotation.z = -elapsed * 0.95;
    p3.pivot.rotation.z = elapsed * 2.0;
    p4.pivot.rotation.z = elapsed * 0.6;

    tr1.rotation.z = elapsed * 1.5;
    tr2.rotation.z = -elapsed * 0.95;
    tr3.rotation.z = elapsed * 2.0;
    tr4.rotation.z = elapsed * 0.6;

    var pulse = 0.5 + Math.sin(elapsed * 2.8) * 0.5;
    glowPL.intensity = 3 + pulse * 4;
    boltMat.emissiveIntensity = 0.5 + pulse * 0.7;

    /* Şimşekler */
    sparkData.forEach(function (s) {
      s.next -= dt;
      if (s.next <= 0) {
        s.life = s.maxLife;
        s.next = 0.4 + Math.random() * 1.8;
        var ox = (Math.random() - 0.5) * 0.06;
        var oy = 0.06 + Math.random() * 0.08;
        var oz = 0.08 + Math.random() * 0.06;
        var ex1 = ox + (Math.random() - 0.5) * 0.25;
        var ey1 = oy + 0.12 + Math.random() * 0.12;
        var ez1 = oz + 0.02;
        var ex2 = ex1 + (Math.random() - 0.5) * 0.18;
        var ey2 = ey1 + Math.random() * 0.1;
        var ex3 = ex2 + (Math.random() - 0.5) * 0.12;
        var ey3 = ey2 + Math.random() * 0.08;
        var arr = new Float32Array([ox, oy, oz, ex1, ey1, ez1, ex2, ey2, ez1, ex3, ey3, ez1]);
        s.line.geometry.setAttribute('position', new THREE.BufferAttribute(arr, 3));
        s.line.geometry.needsUpdate = true;
        s.line.material.opacity = 0.95;
      } else if (s.life > 0) {
        s.life -= dt;
        s.line.material.opacity = Math.max(0, (s.life / s.maxLife) * 0.95);
      }
    });

    pl1.position.x = Math.sin(elapsed * 0.45) * 4;
    pl1.position.y = Math.cos(elapsed * 0.6) * 3;

    renderer.render(scene, camera);
  }
  animate();

  /* ── RESİZE ── */
  window.addEventListener('resize', function () {
    var nW = wrap.clientWidth;
    var nH = wrap.clientHeight || 480;
    renderer.setSize(nW, nH);
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
  });
})();