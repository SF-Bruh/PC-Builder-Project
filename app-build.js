// ============ BUILDING GUIDE ============

const buildSteps = [
  {
    title: "Plan Your Budget & Purpose",
    icon: "💰",
    beginner: [
      "Decide what you'll use the PC for: gaming, schoolwork, video editing, or general use.",
      "Set a realistic budget. A solid gaming PC starts around $700–$1000.",
      "Don't forget to budget for a monitor, keyboard, and mouse if you don't have them!"
    ],
    intermediate: [
      "Define your use case and target resolution/FPS or workload.",
      "Budget allocation: ~35-40% GPU, ~20% CPU, ~15% motherboard+RAM, rest on case/PSU/storage.",
      "Factor in peripherals and any software licenses you may need."
    ],
    advanced: [
      "Define workload profile — gaming (GPU-bound), productivity (CPU/RAM), or hybrid.",
      "Consider price-to-performance ratios at current MSRP; check for generational overlap.",
      "Account for platform longevity (e.g., AM5 vs LGA 1851 upgrade paths)."
    ],
    tip: { type: "info", text: "Use PCPartPicker.com to check compatibility and compare prices across retailers." }
  },
  {
    title: "Choose Your Components",
    icon: "🧩",
    beginner: [
      "<strong>CPU</strong> — The brain of your PC. AMD Ryzen 5 or Intel Core i5 are great starting points.",
      "<strong>GPU</strong> — The graphics card. This matters most for gaming.",
      "<strong>Motherboard</strong> — Make sure it matches your CPU (AMD or Intel).",
      "<strong>RAM</strong> — 16GB DDR5 is the sweet spot right now.",
      "<strong>Storage</strong> — Get an NVMe SSD (1TB) for fast boot and load times.",
      "<strong>Power Supply (PSU)</strong> — Get a reliable 80+ Bronze rated unit, at least 550W.",
      "<strong>Case</strong> — Pick one you like that has good airflow (mesh front panel)."
    ],
    intermediate: [
      "CPU: Match to your workload. Ryzen 7 / i7 for multitasking, Ryzen 5 / i5 for pure gaming.",
      "GPU: Target your resolution — 1080p (RTX 4060 / RX 7600), 1440p (RTX 4070 / RX 7800 XT).",
      "Mobo: Check VRM quality, M.2 slots, USB headers, and rear I/O.",
      "RAM: 2x16GB DDR5 at 6000MT/s CL30 is the current value sweet spot.",
      "Storage: Gen4 NVMe for boot, add a 2TB SATA SSD or HDD for bulk.",
      "PSU: 80+ Gold, fully modular, 650-850W depending on GPU.",
      "Case: Prioritize airflow (mesh), cable management space, and front I/O."
    ],
    advanced: [
      "CPU: Evaluate IPC, boost clocks, cache (e.g., X3D for gaming), and platform thermals.",
      "GPU: Benchmark-match to target res/Hz. Consider VRAM headroom for future titles.",
      "Mobo: VRM thermals, BIOS maturity, PCIe lane allocation, debug LEDs/POST codes.",
      "RAM: Validate QVL, tune sub-timings if Hynix A-die or M-die kits, check FCLK ratio.",
      "Storage: Gen5 NVMe for sequential workloads; Gen4 remains best value for gaming.",
      "PSU: ATX 3.1 w/ native 12V-2x6 connector if running high-end GPU. Check transient response.",
      "Case: Evaluate thermal capacity vs noise profile. Consider custom loop clearance if needed."
    ],
    tip: { type: "warning", text: "Always double-check CPU + Motherboard socket compatibility before buying!" }
  },
  {
    title: "Prepare Your Workspace",
    icon: "🧹",
    beginner: [
      "Find a large, clean, well-lit table or desk.",
      "Keep your motherboard box nearby — you'll build on top of it.",
      "Have a Phillips-head screwdriver ready (that's the + shaped one).",
      "Touch something metal before handling parts to discharge static electricity."
    ],
    intermediate: [
      "Clean, spacious surface. Anti-static mat or motherboard box as work surface.",
      "Phillips #2 screwdriver is all you need for 95% of the build.",
      "Keep zip ties or velcro straps handy for cable management.",
      "Have your manuals open — especially the motherboard manual for front panel headers."
    ],
    advanced: [
      "Prep workspace. Have thermal paste, isopropyl alcohol, lint-free cloth on hand.",
      "Keep motherboard standoffs, M.2 screws, and extra fan splitters accessible.",
      "If doing a custom loop: have paper towels, leak-test setup, and distilled coolant ready."
    ],
    tip: { type: "success", text: "Pro tip: Take photos at each step. If something goes wrong, you can retrace easily." }
  },
  {
    title: "Install the CPU",
    icon: "🔲",
    beginner: [
      "Open the CPU socket on the motherboard (lift the metal lever).",
      "Look for the small triangle on the CPU — match it to the triangle on the socket.",
      "Gently place the CPU in. It should drop in with ZERO force.",
      "Close the lever to lock it in place.",
      "⚠️ NEVER touch the gold pins/pads on the bottom of the CPU!"
    ],
    intermediate: [
      "Lift socket lever, align the alignment triangle/notches, and drop the CPU in — zero insertion force.",
      "For LGA: the plastic cover pops off when you close the retention bracket. Keep it for RMA.",
      "Verify the CPU is seated flush before closing."
    ],
    advanced: [
      "ZIF socket — align, drop, lock. Inspect for bent pins (PGA) or debris (LGA) beforehand.",
      "Retain the socket cover for potential warranty claims.",
      "If delidded or lapped, ensure IHS makes clean contact with retention mechanism."
    ],
    tip: { type: "danger", text: "If the CPU doesn't drop in easily, STOP. Never force it — you'll bend pins and destroy the CPU or motherboard." }
  },
  {
    title: "Install RAM & Storage",
    icon: "💾",
    beginner: [
      "Find the RAM slots on your motherboard (long slots near the CPU).",
      "If you have 2 sticks and 4 slots, use slots 2 and 4 (check your manual).",
      "Open the clips on the slots, line up the notch on the RAM, and push firmly until it clicks.",
      "For your SSD: find the M.2 slot, insert at an angle, then screw it down flat."
    ],
    intermediate: [
      "Populate DIMM slots per manual — typically A2/B2 for dual-channel on 4-slot boards.",
      "Ensure RAM clicks into both retention clips. Partial seating is a top cause of no-POST.",
      "M.2: Remove heatsink, insert at 30° into the slot, press down, screw with standoff."
    ],
    advanced: [
      "Dual-channel config per T-topology or daisy-chain layout (check mobo docs for optimal slots).",
      "For 4-DIMM population at high frequencies, expect to tune VDDQ/VDD and loosen timings.",
      "M.2: Confirm which slots share bandwidth with SATA ports if populating multiple drives."
    ],
    tip: { type: "info", text: "RAM requires more force than you'd expect. A firm, even push until both clips snap is normal." }
  },
  {
    title: "Install CPU Cooler",
    icon: "❄️",
    beginner: [
      "If your cooler came with pre-applied thermal paste (grey pad on bottom), you're good to go!",
      "If not, apply a small pea-sized dot of thermal paste to the center of the CPU.",
      "Mount the cooler on top of the CPU and screw it down in a cross pattern (corner to corner).",
      "Plug the fan cable into the CPU_FAN header on the motherboard."
    ],
    intermediate: [
      "Apply thermal paste (pea/X method) if not pre-applied. Don't over-apply.",
      "Tighten in a cross/star pattern to ensure even mounting pressure.",
      "Route the fan cable to CPU_FAN header. Use CPU_OPT or a splitter for dual-fan towers.",
      "For AIOs: mount radiator as intake (front) or exhaust (top) — tubes down preferred if front-mounted."
    ],
    advanced: [
      "Paste application: contact-pressure method for IHS size. Spreader for large IHS (TR/EPYC).",
      "Mounting pressure: even cross-pattern. Check for IHS bow on large sockets.",
      "AIO orientation: radiator above pump to prevent air accumulation in pump head. Tubes-down if side-mounted.",
      "For custom loops: ensure block mounting doesn't put uneven pressure on the IHS."
    ],
    tip: { type: "warning", text: "Don't forget to remove the plastic cover from the bottom of the cooler before mounting!" }
  },
  {
    title: "Mount Motherboard in Case",
    icon: "📦",
    beginner: [
      "Install the I/O shield (metal plate) into the back of the case — it snaps in from inside.",
      "Place standoffs in the case that match your motherboard size (usually pre-installed).",
      "Lower the motherboard in gently, aligning it with the I/O shield and standoff holes.",
      "Screw in all the motherboard screws — don't over-tighten!"
    ],
    intermediate: [
      "Pre-install I/O shield (unless integrated into the board). Align standoffs to ATX/mATX/ITX pattern.",
      "Seat the board, align rear I/O with shield, and secure with all standoff screws.",
      "Snug-tight, not gorilla-tight — you're screwing into brass standoffs."
    ],
    advanced: [
      "Verify standoff placement matches form factor. Extra standoffs can short the PCB.",
      "For ITX: consider whether to pre-route cables before seating the board.",
      "Ensure no motherboard flex — all standoff points should make contact."
    ],
    tip: { type: "info", text: "Most modern motherboards have a built-in I/O shield — check before trying to install a separate one!" }
  },
  {
    title: "Install GPU & Power Supply",
    icon: "⚡",
    beginner: [
      "Slide the power supply into the bottom of the case and screw it in from the back.",
      "Remove the metal slot covers on the back of the case for your GPU (usually 2 slots).",
      "Push the GPU firmly into the top PCIe slot on the motherboard until it clicks.",
      "Screw the GPU bracket to the case so it doesn't sag.",
      "Connect the power cables: 24-pin to motherboard, 8-pin to CPU, and PCIe cables to GPU."
    ],
    intermediate: [
      "PSU: Fan-down for bottom intake (if case has a vent). Route cables through the back.",
      "GPU: Seat in the top x16 PCIe slot. Ensure the retention clip engages.",
      "Cables: 24-pin ATX, 8-pin EPS (CPU), PCIe power to GPU. Use separate cables — don't daisy-chain for high-end GPUs.",
      "Cable management: route through grommets, tie down excess in the back panel."
    ],
    advanced: [
      "PSU orientation per case ventilation. For SFX in ATX cases, use adapter bracket.",
      "GPU: Primary x16 slot (CPU-direct lanes). Check clearance for triple-slot cards.",
      "12V-2x6 / 12VHPWR: ensure full insertion, no melted connectors. Avoid sharp bends at the terminal.",
      "Cable management: plan routes before connecting. Consider cable combs and custom-length cables."
    ],
    tip: { type: "danger", text: "NEVER mix power supply cables between brands! Each brand has different pin wiring. Using wrong cables can fry your components." }
  },
  {
    title: "Connect Front Panel & Fans",
    icon: "🔌",
    beginner: [
      "This is the fiddly part! Connect the small front panel wires from your case:",
      "• Power button, Reset button, Power LED, HDD LED — check motherboard manual for layout.",
      "Connect the front USB and audio cables to the matching headers on the motherboard.",
      "Make sure all case fans are plugged into fan headers (SYS_FAN or CHA_FAN)."
    ],
    intermediate: [
      "Front panel headers: use the mobo manual diagram. Power SW polarity doesn't matter; LEDs do.",
      "USB 3.0 (20-pin), USB-C (key-A), HD Audio — all keyed connectors.",
      "Fan config: intake front/bottom, exhaust rear/top. Positive pressure reduces dust buildup."
    ],
    advanced: [
      "JFP1 pinout per manual. Use a front-panel header adapter if available for cleaner install.",
      "Verify USB-C header compatibility if case has Type-C front port. Some boards lack the header.",
      "Fan curve setup in BIOS: optimize for PWM control. Set intake > exhaust CFM for positive pressure."
    ],
    tip: { type: "info", text: "The front panel connectors are the trickiest part for everyone. Take your time and use the manual." }
  },
  {
    title: "First Boot & Setup",
    icon: "🚀",
    beginner: [
      "Double-check all cables are connected. Take a deep breath!",
      "Plug in the power cable and flip the PSU switch on the back.",
      "Press the power button. If fans spin and you see the BIOS screen — congratulations! 🎉",
      "If nothing happens: check the power button cable, PSU switch, and make sure RAM is seated.",
      "Install Windows using a USB drive (you can create one with Microsoft's Media Creation Tool).",
      "After Windows is installed, download your GPU drivers from NVIDIA or AMD's website."
    ],
    intermediate: [
      "First POST: enter BIOS, verify all hardware is detected (CPU, RAM, storage).",
      "Enable XMP/EXPO for rated RAM speeds. Set boot priority to USB for OS install.",
      "Install OS, then drivers: GPU > chipset > audio > networking.",
      "Run a stress test (Cinebench, Furmark, or OCCT) to verify stability and thermals."
    ],
    advanced: [
      "POST: verify CPU/RAM/NVMe detection. Check for error codes if no POST (debug LEDs, beep codes, Q-code).",
      "BIOS: enable XMP/EXPO, set fan curves, verify PCIe slot config (Gen4/5), enable Resizable BAR/SAM.",
      "OS: clean install, debloat, chipset + GPU drivers, firmware updates.",
      "Stress test: Prime95 small FFTs (CPU), Furmark/3DMark (GPU), MemTest86 (RAM). Monitor via HWiNFO64.",
      "Tune: PBO2/Curve Optimizer (AMD) or unlock power limits (Intel) if desired."
    ],
    tip: { type: "success", text: "No display on first boot? Don't panic! Reseat your RAM and GPU — that fixes 90% of first-boot issues." }
  }
];

let currentBuildStep = 0;

async function startBuildingGuide() {
  currentBuildStep = 0;
  setProgress(45);

  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang(
        "Awesome! Let's build your first PC together. I'll walk you through every single step — nice and easy. 🎉",
        "Let's get this build going. Here's your step-by-step guide.",
        "Build guide loaded. Let's get to it."
      )}
      <div class="tip-box info">
        <span class="tip-icon">📋</span>
        <span>${buildSteps.length} steps total. Take your time with each one — no rush.</span>
      </div>
    </div>
  `, 'bot', 200);

  showBuildStep();
}

async function showBuildStep() {
  const step = buildSteps[currentBuildStep];
  const points = step[userLevel];
  const pct = 45 + ((currentBuildStep / buildSteps.length) * 50);
  setProgress(pct);

  const listItems = points.map(p => `<li>${p}</li>`).join('');

  let tipHtml = '';
  if (step.tip) {
    tipHtml = `<div class="tip-box ${step.tip.type}">
      <span class="tip-icon">${step.tip.type === 'danger' ? '⚠️' : step.tip.type === 'warning' ? '💡' : step.tip.type === 'success' ? '✅' : 'ℹ️'}</span>
      <span>${step.tip.text}</span>
    </div>`;
  }

  const isLast = currentBuildStep === buildSteps.length - 1;
  const btnText = isLast
    ? lang("I'm done! 🎉", "Complete Build ✓", "Finalize →")
    : lang("Got it, next step →", "Next step →", "Continue →");
  const btnClass = isLast ? 'continue-btn success-btn' : 'continue-btn';

  await addMessage(`
    <div class="message-label">Step ${currentBuildStep + 1} of ${buildSteps.length}</div>
    <div class="message-bubble">
      <div class="step-card">
        <div class="step-header">
          <div class="step-number">${currentBuildStep + 1}</div>
          <div class="step-title">${step.icon} ${step.title}</div>
        </div>
        <div class="step-body">
          <ul>${listItems}</ul>
        </div>
      </div>
      ${tipHtml}
      <div style="margin-top:14px;">
        <button class="${btnClass}" onclick="nextBuildStep()">${btnText}</button>
      </div>
    </div>
  `, 'bot', 200);
}

async function nextBuildStep() {
  currentBuildStep++;
  if (currentBuildStep < buildSteps.length) {
    showBuildStep();
  } else {
    showCompletion('building');
  }
}
