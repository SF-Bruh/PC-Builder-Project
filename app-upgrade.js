// ============ MAINTENANCE PATH ============

async function showMaintainMenu() {
  setProgress(45);
  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang(
        "No problem! Are you looking to upgrade a part, or is something not working right?",
        "Are we upgrading or troubleshooting?",
        "Upgrade or troubleshoot?"
      )}
      <div class="options-grid horizontal" style="margin-top:14px;">
        <button class="option-card" onclick="chooseMaintainType('upgrade')">
          <span class="option-icon">⬆️</span>
          <div class="option-info">
            <span class="option-title">${lang("Upgrade a Part", "Upgrade Hardware", "Component Upgrade")}</span>
            <span class="option-desc">${lang("I want to make my PC faster or add something new", "Swap or add components", "Swap/add components to improve performance")}</span>
          </div>
        </button>
        <button class="option-card" onclick="chooseMaintainType('fix')">
          <span class="option-icon">🔍</span>
          <div class="option-info">
            <span class="option-title">${lang("Fix a Problem", "Troubleshoot Issue", "Diagnose & Fix")}</span>
            <span class="option-desc">${lang("Something is wrong — it's slow, hot, crashing, etc.", "Temps, crashes, performance issues", "Thermal, stability, or performance diagnostics")}</span>
          </div>
        </button>
      </div>
    </div>
  `, 'bot', 200);
}

async function chooseMaintainType(type) {
  await addUserReply(type === 'upgrade' ? '⬆️ Upgrade' : '🔍 Fix a Problem');
  if (type === 'upgrade') showUpgradeGuide();
  else showFixMenu();
}

// ---- UPGRADE GUIDE ----

async function showUpgradeGuide() {
  setProgress(50);
  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang("What part are you looking to upgrade?", "What component are we upgrading?", "Select the target component.")}
      <div class="options-grid" style="margin-top:12px;">
        <button class="option-card" onclick="showUpgradeDetail('gpu')">
          <span class="option-icon">🎮</span>
          <div class="option-info">
            <span class="option-title">Graphics Card (GPU)</span>
            <span class="option-desc">${lang("Better gaming and video performance", "Upgrade your graphics power", "GPU swap / upgrade")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('ram')">
          <span class="option-icon">🧠</span>
          <div class="option-info">
            <span class="option-title">RAM (Memory)</span>
            <span class="option-desc">${lang("Help your PC do more at once", "More memory for multitasking", "Increase memory capacity/speed")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('storage')">
          <span class="option-icon">💽</span>
          <div class="option-info">
            <span class="option-title">Storage (SSD/HDD)</span>
            <span class="option-desc">${lang("More space or faster loading", "Faster or bigger storage", "Add/upgrade NVMe or SATA drives")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('cpu')">
          <span class="option-icon">⚙️</span>
          <div class="option-info">
            <span class="option-title">CPU (Processor)</span>
            <span class="option-desc">${lang("A faster brain for your PC", "Faster processor", "CPU upgrade within platform")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showUpgradeDetail('cooling')">
          <span class="option-icon">🌀</span>
          <div class="option-info">
            <span class="option-title">Cooling</span>
            <span class="option-desc">${lang("Keep your PC cooler and quieter", "Better thermals and noise", "Improve thermal headroom")}</span>
          </div>
        </button>
      </div>
    </div>
  `, 'bot', 200);
}

const upgradeGuides = {
  gpu: {
    title: "GPU Upgrade Guide",
    icon: "🎮",
    beginner: [
      { title: "Check Compatibility", body: "Open your PC case and look at your current GPU. Check your power supply wattage (it's on the label on your PSU). Most new GPUs need at least 550-650W." },
      { title: "Choose Your New GPU", body: "For 1080p gaming: RTX 4060 or RX 7600. For 1440p: RTX 4070 Super or RX 7800 XT. Make sure it physically fits in your case!" },
      { title: "Remove the Old GPU", body: "Turn off PC, unplug it. Remove the power cables from the GPU. Unscrew it from the case bracket. Press the release tab on the PCIe slot and gently pull the card out." },
      { title: "Install the New GPU", body: "Slide the new GPU into the same slot until it clicks. Screw in the bracket. Connect the power cables. That's it!" },
      { title: "Install Drivers", body: "Boot up, download the latest drivers from NVIDIA.com or AMD.com, install them, and restart. You're gaming! 🎉" }
    ],
    intermediate: [
      { title: "Pre-Upgrade Checks", body: "Verify PSU wattage and available PCIe power connectors. Measure case clearance (length and slot width). Use DDU to clean old GPU drivers before swapping." },
      { title: "Physical Swap", body: "Power off, disconnect PSU. Remove PCIe power cables, unscrew bracket, release PCIe retention clip, extract card. Reverse for new card." },
      { title: "Post-Install", body: "Boot into safe mode, run DDU for clean driver removal. Reboot, install latest GPU drivers. Enable Resizable BAR in BIOS if supported. Run a benchmark to verify." }
    ],
    advanced: [
      { title: "Compatibility & Planning", body: "Check TDP vs PSU transient capability (not just sustained wattage). Verify 12V-2x6 / 8-pin connector availability. Measure case clearance including AIO radiator conflicts." },
      { title: "Swap Procedure", body: "DDU in safe mode before physical swap. Remove old card, seat new card in primary x16 slot. Check for PCIe gen negotiation in GPU-Z post-boot." },
      { title: "Optimization", body: "Enable Resizable BAR/SAM, verify PCIe link speed. Undervolt for efficiency (MSI Afterburner curve editor). Benchmark: 3DMark Timespy, compare to published results." }
    ],
    tip: { type: "warning", text: "Use DDU (Display Driver Uninstaller) to cleanly remove old GPU drivers before installing new ones. This prevents conflicts and crashes." }
  },
  ram: {
    title: "RAM Upgrade Guide",
    icon: "🧠",
    beginner: [
      { title: "Find Out What You Have", body: "Open Task Manager (Ctrl+Shift+Esc) → Performance → Memory. This shows your current RAM amount and speed. Note how many slots are used." },
      { title: "Buy Compatible RAM", body: "Check your motherboard manual or use Crucial's scanner tool online. Match the type (DDR4 or DDR5) — you can't mix them!" },
      { title: "Install It", body: "Turn off and unplug your PC. Open the clips on the RAM slots. Line up the notch on the new stick and push firmly until it clicks. That's it!" }
    ],
    intermediate: [
      { title: "Assessment", body: "Check current config: CPU-Z or HWiNFO for speed, timings, slots populated. Check QVL on motherboard support page for validated kits." },
      { title: "Selection", body: "Match DDR generation. For best compatibility, buy a single matched kit rather than mixing. 2x16GB DDR5-6000 CL30 is the current sweet spot." },
      { title: "Install & Configure", body: "Populate correct slots per manual (usually A2/B2). After boot, enter BIOS and enable XMP/EXPO profile. Verify with CPU-Z." }
    ],
    advanced: [
      { title: "Analysis", body: "Identify current IC (Thaiphoon Burner). Check rank configuration (SR vs DR) and daisy-chain/T-topology layout for optimal population." },
      { title: "Selection", body: "Target specific ICs: Hynix A-die for DDR5 overclocking, M-die for value. Verify QVL compatibility or be prepared to manually tune." },
      { title: "Tuning", body: "Enable XMP/EXPO as baseline. Manual tuning: tRCD, tRP, tRAS, then secondaries. Adjust VDDQ and VDD. Stability test with TM5/ANTA777 or y-cruncher." }
    ],
    tip: { type: "info", text: "Always buy RAM in kits (e.g., 2x16GB) rather than individual sticks. Kits are tested together for compatibility." }
  },
  storage: {
    title: "Storage Upgrade Guide",
    icon: "💽",
    beginner: [
      { title: "Check What You Need", body: "Running out of space? Add another drive. PC feels slow? Upgrading from a hard drive to an SSD will make the biggest difference you've ever felt." },
      { title: "Choose Your Drive", body: "NVMe SSD (the small stick) is fastest and easiest to install. A 1TB NVMe like the Samsung 970 Evo Plus is a great choice." },
      { title: "Install It", body: "Find an empty M.2 slot on your motherboard (check manual). Remove the screw, slide the SSD in at an angle, then press down and screw it flat." },
      { title: "Set It Up", body: "In Windows, right-click Start → Disk Management. Find your new drive, initialize it, and create a new volume. Done!" }
    ],
    intermediate: [
      { title: "Plan", body: "Assess current storage layout. Determine if adding a drive or cloning/migrating the OS to a faster one." },
      { title: "Selection", body: "Gen4 NVMe for boot (Samsung 990 Pro, WD SN850X). SATA SSD or HDD for bulk storage. Check which M.2 slots share SATA bandwidth." },
      { title: "Install & Migrate", body: "Physical install in M.2 or 2.5\" bay. For OS migration, use Macrium Reflect or Samsung Data Migration. Set boot priority in BIOS." }
    ],
    advanced: [
      { title: "Assessment", body: "Map current PCIe/SATA lane allocation. Check for M.2 slots that disable SATA ports when populated. Consider RAID if needed." },
      { title: "Selection", body: "Gen5 NVMe for sequential-heavy workloads (video editing). Gen4 remains best perf/$ for gaming. Evaluate TLC vs QLC endurance for write-heavy use." },
      { title: "Deployment", body: "Sector-by-sector clone for OS migration (Clonezilla, Macrium). Post-clone: verify alignment, enable TRIM, check SMART attributes. Update boot order." }
    ],
    tip: { type: "success", text: "Upgrading from HDD to SSD is the single biggest performance upgrade you can make to an old PC." }
  },
  cpu: {
    title: "CPU Upgrade Guide",
    icon: "⚙️",
    beginner: [
      { title: "Check Compatibility First!", body: "This is the most important step. Your new CPU MUST work with your motherboard. Search your motherboard model + 'CPU support list' online." },
      { title: "Things to Know", body: "You might need to update your BIOS before the new CPU will work. This can usually be done with your current CPU installed." },
      { title: "The Swap", body: "Remove the cooler, clean off thermal paste with rubbing alcohol, lift the CPU lever, swap CPUs (match the triangles!), apply new paste, remount cooler." },
      { title: "After the Swap", body: "Boot up and enter BIOS to make sure the new CPU is detected. Re-enable XMP/EXPO for your RAM. You're good to go!" }
    ],
    intermediate: [
      { title: "Compatibility", body: "Check motherboard QVL/CPU support list. BIOS update may be required — do this BEFORE swapping CPUs. Verify VRM capability for higher-tier CPUs." },
      { title: "Swap Procedure", body: "Remove cooler, clean paste (IPA + lint-free cloth), swap CPUs, apply paste, remount cooler. Update BIOS if not done pre-swap." },
      { title: "Post-Install", body: "Verify detection in BIOS. Re-enable XMP/EXPO. Check thermals under load. Consider whether your cooler is adequate for the new CPU's TDP." }
    ],
    advanced: [
      { title: "Planning", body: "Check VRM thermal capacity for new SKU (especially 12900K+ or 7950X tier). Flash latest BIOS with current CPU. Check if cooler mounting pressure is adequate." },
      { title: "Execution", body: "Clean swap. Inspect socket for debris/bent pins. Apply thermal paste per IHS size. Verify cooler contact/mounting pressure." },
      { title: "Optimization", body: "Post-swap: reset BIOS to defaults, re-enable XMP/EXPO, configure PBO2/Curve Optimizer or Intel power limits. Stress test for stability." }
    ],
    tip: { type: "danger", text: "Always update your motherboard BIOS before installing a newer-generation CPU. Without the update, your PC may not boot at all." }
  },
  cooling: {
    title: "Cooling Upgrade Guide",
    icon: "🌀",
    beginner: [
      { title: "Signs You Need Better Cooling", body: "Is your PC loud? Does it feel very hot? Do games stutter after playing for a while? Better cooling can fix all of these!" },
      { title: "Easy Upgrades", body: "Add case fans if you have empty slots (most cases support 3-6 fans). Replace the stock CPU cooler with an aftermarket one like the Thermalright Peerless Assassin." },
      { title: "Fan Direction", body: "Front and bottom fans should blow IN (intake). Rear and top fans should blow OUT (exhaust). Look for the arrow on the fan frame." },
      { title: "Thermal Paste Refresh", body: "If your PC is a few years old, cleaning off the old thermal paste and applying fresh paste can drop temperatures by 5-10°C!" }
    ],
    intermediate: [
      { title: "Assessment", body: "Monitor temps with HWiNFO64. CPU above 85°C or GPU above 83°C under sustained load indicates cooling improvement needed." },
      { title: "Case Fans", body: "Aim for positive pressure (more intake than exhaust). Quality fans: Arctic P12/P14, Noctua NF-A12x25, Thermalright TL-C12C. Use PWM for speed control." },
      { title: "CPU Cooler Upgrade", body: "Tower coolers: Thermalright PA120, Deepcool AK620. AIOs: Arctic Liquid Freezer II 240/280. Match TDP to your CPU's power draw." },
      { title: "Maintenance", body: "Repaste every 2-3 years. Clean dust filters monthly. Compressed air for heatsink fins quarterly." }
    ],
    advanced: [
      { title: "Thermal Analysis", body: "Use HWiNFO64 for per-core temps, hotspot deltas, and VRM thermals. Identify if CPU, GPU, VRM, or case ambient is the bottleneck." },
      { title: "Optimization", body: "Fan curves in BIOS: target temp-based PWM, not voltage control. Optimal config: slightly positive pressure, front intake, top/rear exhaust." },
      { title: "Advanced Cooling", body: "Direct-die cooling for extreme thermals. Custom loop: EK/HWLabs rads, copper blocks, ZMT or PETG tubing. Factor in maintenance overhead." },
      { title: "Paste & Contact", body: "Premium pastes (Thermal Grizzly Kryonaut, Noctua NT-H2). For extreme: liquid metal (Conductonaut) — insulate surrounding SMDs with nail polish or Kapton tape." }
    ],
    tip: { type: "warning", text: "Liquid metal is electrically conductive. If it drips onto your motherboard, it will short-circuit components. Only use if experienced!" }
  }
};

async function showUpgradeDetail(component) {
  const guide = upgradeGuides[component];
  const steps = guide[userLevel];
  setProgress(55);

  await addUserReply(`${guide.icon} ${guide.title}`);

  let stepsHtml = steps.map((s, i) => `
    <div class="step-card" style="margin-bottom:8px;">
      <div class="step-header">
        <div class="step-number">${i + 1}</div>
        <div class="step-title">${s.title}</div>
      </div>
      <div class="step-body">${s.body}</div>
    </div>
  `).join('');

  let tipHtml = guide.tip ? `<div class="tip-box ${guide.tip.type}">
    <span class="tip-icon">${guide.tip.type === 'danger' ? '⚠️' : guide.tip.type === 'warning' ? '💡' : guide.tip.type === 'success' ? '✅' : 'ℹ️'}</span>
    <span>${guide.tip.text}</span>
  </div>` : '';

  await addMessage(`
    <div class="message-label">PC Build Buddy — ${guide.title}</div>
    <div class="message-bubble">
      ${stepsHtml}
      ${tipHtml}
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="continue-btn secondary" onclick="showUpgradeGuide()">← Other Upgrades</button>
        <button class="continue-btn success-btn" onclick="showCompletion('upgrade')">Done ✓</button>
      </div>
    </div>
  `, 'bot', 200);
}

// ---- TROUBLESHOOTING / FIX PATH ----

async function showFixMenu() {
  setProgress(50);