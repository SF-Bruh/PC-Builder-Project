  await addMessage(`
    <div class="message-label">PC Build Buddy</div>
    <div class="message-bubble">
      ${lang(
        "What's going on with your PC? Pick the one that sounds closest:",
        "What's the issue? Select the closest match:",
        "Select the symptom category:"
      )}
      <div class="options-grid" style="margin-top:12px;">
        <button class="option-card" onclick="showFixDetail('hot')">
          <span class="option-icon">🌡️</span>
          <div class="option-info">
            <span class="option-title">${lang("It's running really hot", "High temperatures", "Thermal throttling / high temps")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('slow')">
          <span class="option-icon">🐌</span>
          <div class="option-info">
            <span class="option-title">${lang("It's really slow", "Sluggish performance", "Performance degradation")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('crash')">
          <span class="option-icon">💥</span>
          <div class="option-info">
            <span class="option-title">${lang("It crashes or freezes", "Crashes / BSODs", "System instability / BSODs")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('noboot')">
          <span class="option-icon">🖥️</span>
          <div class="option-info">
            <span class="option-title">${lang("It won't turn on or show anything", "No POST / no display", "No POST / boot failure")}</span>
          </div>
        </button>
        <button class="option-card" onclick="showFixDetail('noise')">
          <span class="option-icon">🔊</span>
          <div class="option-info">
            <span class="option-title">${lang("It's making weird noises", "Unusual noises", "Abnormal acoustic output")}</span>
          </div>
        </button>
      </div>
    </div>
  `, 'bot', 200);
}

const fixGuides = {
  hot: {
    title: "High Temperature Fix",
    icon: "🌡️",
    beginner: [
      { title: "Check for Dust", body: "Dust is the #1 cause of overheating. Turn off your PC, open the case, and use a can of compressed air to blow dust off all fans and heatsinks. Do this outside if possible!" },
      { title: "Check Fan Placement", body: "Make sure all fans are spinning. Front fans should blow in (intake), back and top fans should blow out (exhaust). If a fan isn't spinning, it may need to be replaced." },
      { title: "Check Thermal Paste", body: "If your PC is 2+ years old, the thermal paste between the CPU and cooler may have dried out. You can buy thermal paste for ~$8 and reapply it. Clean the old paste with rubbing alcohol first." },
      { title: "Improve Airflow", body: "Don't block the vents! Keep your PC off carpet, away from walls, and make sure cables inside aren't blocking fans. A mesh-front case helps a lot." },
      { title: "Monitor Temps", body: "Download a free tool called HWiNFO64 to see your temperatures. CPU should stay under 85°C, GPU under 83°C during gaming." }
    ],
    intermediate: [
      { title: "Diagnostics", body: "Run HWiNFO64 — check CPU Tctl/Tdie, GPU hotspot, VRM temps under load. Identify which component is throttling. Check if fans are ramping up appropriately." },
      { title: "Maintenance", body: "Full dust-out with compressed air. Repaste CPU (and GPU if over 3 years old). Verify all fans are operational and PWM-controlled." },
      { title: "Airflow Optimization", body: "Ensure positive pressure (more intake CFM than exhaust). Add fans if case supports more. Check that fan curves aren't set too conservative in BIOS." },
      { title: "Software Side", body: "Check for background processes consuming CPU (Task Manager). Verify GPU drivers are current. Disable unnecessary startup programs." }
    ],
    advanced: [
      { title: "Thermal Profiling", body: "HWiNFO64: log CPU per-core temps, hotspot delta, package power, VRM MOS temps under Prime95/OCCT. Identify thermal bottleneck — die, IHS, cooler, or case ambient." },
      { title: "Contact & Paste", body: "Repaste with premium compound (Kryonaut, NT-H2). Check mounting pressure — uneven contact causes hotspots. Consider IHS convexity correction (lapping) for extreme cases." },
      { title: "Airflow Engineering", body: "Map airflow with incense/smoke. Eliminate dead zones and recirculation. Seal unused PCI brackets and cable grommets if negative pressure." },
      { title: "Advanced Mitigation", body: "Undervolt CPU (Curve Optimizer / VF offset) and GPU (Afterburner curve). Reduces heat without significant performance loss. Custom fan curves targeting component temps, not CPU-only." }
    ],
    tip: { type: "success", text: "A simple dust cleaning + thermal paste refresh fixes overheating in 80% of cases." }
  },
  slow: {
    title: "Slow Performance Fix",
    icon: "🐌",
    beginner: [
      { title: "Close Unnecessary Programs", body: "Press Ctrl+Shift+Esc to open Task Manager. Click 'Startup' and disable programs you don't need at startup. This alone can make a huge difference!" },
      { title: "Check Storage Space", body: "If your main drive is almost full (over 90%), your PC will slow down. Delete or move files you don't need. Empty the Recycle Bin too!" },
      { title: "HDD to SSD Upgrade", body: "If your Windows is on a regular hard drive (HDD), upgrading to an SSD is the BEST upgrade. It makes everything 5-10x faster. This is the single biggest improvement you can make." },
      { title: "Check for Malware", body: "Run a full Windows Defender scan. Also try the free version of Malwarebytes for a second opinion. Malware can secretly use your PC's resources." },
      { title: "Windows Updates", body: "Make sure Windows is fully updated. Go to Settings → Update & Security → Windows Update. Sometimes updates fix performance bugs." },
      { title: "Add More RAM", body: "If Task Manager shows memory usage above 80% during normal use, you probably need more RAM. 16GB is the minimum recommended these days." }
    ],
    intermediate: [
      { title: "Diagnostics", body: "Task Manager: identify CPU, RAM, or Disk bottleneck. Resource Monitor for detailed I/O. Check if HDD is the primary drive — if so, SSD migration is priority #1." },
      { title: "Software Cleanup", body: "Disable startup bloat (Task Manager → Startup). Uninstall unused programs. Check for background services consuming resources (svchost, Windows telemetry)." },
      { title: "Hardware Check", body: "Verify RAM is running in dual-channel at rated speed (CPU-Z). Check SSD health (CrystalDiskInfo). Ensure GPU drivers are current and not using basic display adapter." },
      { title: "OS Optimization", body: "Disable unnecessary visual effects, indexed search on secondary drives. Set power plan to High Performance or Balanced. Consider a clean Windows install if it's been years." }
    ],
    advanced: [
      { title: "Profiling", body: "Process Monitor / Process Explorer for granular resource tracking. Windows Performance Recorder for system-wide analysis. Check DPC latency (LatencyMon) for driver issues." },
      { title: "Storage", body: "Check SMART attributes (CrystalDiskInfo). SSD firmware updates. Verify NVMe driver (vendor-specific vs generic MS). Check TRIM status: fsutil behavior query DisableDeleteNotify." },
      { title: "Memory & CPU", body: "Verify XMP/EXPO enabled. Check for single-channel RAM config. Analyze CPU throttling (power or thermal) via HWiNFO64. Inspect Windows power plan advanced settings." },
      { title: "Nuclear Option", body: "If software-side: clean Windows install with debloat. If hardware-side: benchmark individual components to isolate bottleneck (CineBench, CrystalDiskMark, 3DMark)." }
    ],
    tip: { type: "info", text: "90% of 'slow PC' complaints are caused by: full HDD, too many startup programs, or insufficient RAM. Check these first!" }
  },
  crash: {
    title: "Crash / BSOD Fix",
    icon: "💥",
    beginner: [
      { title: "Don't Panic!", body: "Blue screens (BSODs) look scary but are usually fixable. Your PC is protecting itself by shutting down when something goes wrong." },
      { title: "Note the Error", body: "When you see a blue screen, try to note the error message (like 'WHEA_UNCORRECTABLE_ERROR' or 'MEMORY_MANAGEMENT'). Take a photo with your phone!" },
      { title: "Check for Overheating", body: "Overheating is a common crash cause. Follow the temperature troubleshooting steps to rule this out." },
      { title: "Update Drivers", body: "Outdated GPU drivers cause many crashes. Go to NVIDIA.com or AMD.com and download the latest driver for your graphics card." },
      { title: "Check RAM", body: "Faulty RAM is a top crash cause. Windows has a built-in memory test: search 'Windows Memory Diagnostic' in the Start menu and run it." },
      { title: "System Restore", body: "If crashes started recently, try System Restore to go back to a point before they started. Search 'System Restore' in the Start menu." }
    ],
    intermediate: [
      { title: "BSOD Analysis", body: "Check Event Viewer → Windows Logs → System for critical errors. Use BlueScreenView to analyze minidump files (C:\\Windows\\Minidump). The error code indicates the subsystem." },
      { title: "Common Codes", body: "WHEA_UNCORRECTABLE: CPU/hardware fault. MEMORY_MANAGEMENT: RAM issue. IRQL_NOT_LESS_OR_EQUAL: driver conflict. KMODE_EXCEPTION: driver/hardware. VIDEO_TDR: GPU driver timeout." },
      { title: "Testing", body: "RAM: run MemTest86 overnight. GPU: run Furmark/Unigine for stability. CPU: Prime95 small FFTs. Check each component individually." },
      { title: "Software Fixes", body: "DDU and reinstall GPU drivers. sfc /scannow and DISM for Windows file corruption. Check for BIOS updates — they often fix stability." }
    ],
    advanced: [
      { title: "Dump Analysis", body: "WinDbg: !analyze -v on minidumps. Check faulting module, exception code, stack trace. Cross-reference with known driver/firmware bugs." },
      { title: "Hardware Isolation", body: "MemTest86 overnight (multi-pass). Prime95 small FFTs (per-core failure = specific core issue). Furmark for GPU VRAM stability. Monitor VRM temps during stress." },
      { title: "Stability Tuning", body: "If overclocked: revert to stock and test. WHEA errors often indicate unstable CPU curve/OC. Check event 19 (WHEA Logger) for correctable errors that precede hard crashes." },
      { title: "Advanced Fixes", body: "Check PCIe link stability (event 56, IOMMU errors). Test with different PCIe gen settings. Verify PSU rail stability under load with a multimeter or software monitoring." }
    ],
    tip: { type: "warning", text: "If crashes happen ONLY during gaming: GPU drivers or thermals. If they happen randomly: RAM, PSU, or CPU stability." }
  },
  noboot: {
    title: "No Boot / No Display Fix",
    icon: "🖥️",
    beginner: [
      { title: "Check the Basics", body: "Is the power cable plugged in? Is the power strip turned on? Is the PSU switch on the back flipped to 'I' (on)? Sounds silly, but check these first!" },
      { title: "Check Your Monitor", body: "Is the monitor on? Is the cable plugged into the GRAPHICS CARD (not the motherboard)? Try a different cable (HDMI, DisplayPort). Try a different monitor if possible." },
      { title: "Listen & Look", body: "When you press power: Do fans spin? Do any lights turn on? Do you hear any beeps? These clues tell us what's going on." },
      { title: "Reseat Components", body: "Turn off and unplug your PC. Press and firmly reseat (push back in) the RAM sticks and GPU. Loose connections are a very common cause of no-boot." },
      { title: "Try One RAM Stick", body: "Try booting with just one RAM stick at a time, in different slots. A bad stick or slot can prevent booting entirely." },
      { title: "CMOS Reset", body: "Find the small round battery on your motherboard. Remove it for 30 seconds, then put it back. This resets your BIOS settings and can fix boot issues." }
    ],
    intermediate: [
      { title: "Debug Indicators", body: "Check mobo debug LEDs (CPU, DRAM, VGA, BOOT) or Q-code display. Listen for beep codes (if speaker connected). These pinpoint the failing component." },
      { title: "Minimal Boot", body: "Strip to essentials: CPU + 1 RAM stick + onboard video (if available). No storage, no GPU. Add components one by one until failure reproduces." },
      { title: "RAM & GPU", body: "Reseat RAM in the correct slots. Try each stick individually. Reseat GPU and ensure PCIe power is connected. Try GPU in a different slot if available." },
      { title: "CMOS & BIOS", body: "Clear CMOS (remove battery 60s or use jumper). If you have BIOS Flashback, reflash BIOS via USB. Check if a recent BIOS update corrupted settings." }
    ],
    advanced: [
      { title: "POST Diagnostics", body: "Read Q-code or debug LEDs. Cross-reference with motherboard manual POST codes. If board has no POST code display, use a POST card ($10 diagnostic tool)." },
      { title: "Isolation Protocol", body: "Bare-bones bench boot: CPU + 1 DIMM + onboard/debug GPU outside the case on motherboard box. Eliminates case short and peripheral issues." },
      { title: "Component Testing", body: "Swap PSU if available (or paperclip test for PSU power-on). Test RAM sticks individually in each slot. Check for bent CPU pins (AMD PGA) or socket debris (Intel LGA)." },
      { title: "Advanced Recovery", body: "BIOS Flashback / Q-Flash Plus if available (works without CPU). Check for dead short (PSU clicks off immediately = short circuit, inspect standoffs and stray screws)." }
    ],
    tip: { type: "danger", text: "If fans spin briefly then stop, or PSU clicks: this usually means a short circuit. Check for loose screws under the motherboard or a misplaced standoff." }
  },
  noise: {
    title: "Unusual Noise Fix",
    icon: "🔊",
    beginner: [
      { title: "Identify the Source", body: "Open your case (PC off and unplugged) and spin each fan by hand. A grinding or rattling fan needs to be replaced — fans are cheap ($10-15 each)." },
      { title: "Loose Screws", body: "A buzzing or vibrating noise often means a loose screw or panel. Check that all case screws, fan screws, and side panels are tight." },
      { title: "Hard Drive Clicking", body: "If you hear rhythmic clicking from inside the PC, it might be a failing hard drive. Back up your data immediately and consider replacing it with an SSD." },
      { title: "Coil Whine", body: "A high-pitched whining during gaming is called 'coil whine' from the GPU. It's annoying but not dangerous. Using a frame rate limiter (V-Sync) can reduce it." }
    ],
    intermediate: [
      { title: "Diagnosis", body: "Isolate: stop each fan individually (finger test while running — be careful!) to identify the source. GPU fans, CPU fan, case fans, PSU fan." },
      { title: "Fan Bearing Failure", body: "Grinding/clicking from fans = bearing failure. Replace the fan. Quality replacements: Arctic P12, Noctua NF-A12x25. Match size (120mm/140mm)." },
      { title: "Coil Whine", body: "GPU coil whine: frame cap with RTSS or V-Sync. Can change with GPU load. Some units worse than others — not a defect per se, but may be RMA-able if extreme." },
      { title: "HDD & PSU", body: "Clicking HDD: check SMART status (CrystalDiskInfo), back up immediately if reallocated sectors are high. PSU clicking under load: potential capacitor issue, consider replacement." }
    ],
    advanced: [
      { title: "Acoustic Profiling", body: "Isolate source by selectively stopping fans. Check pump noise (AIO) — air bubbles in loop cause gurgling. PSU fan rattle may indicate bearing or loose blade." },
      { title: "Coil Whine Mitigation", body: "GPU: frame cap at monitor Hz, undervolt to reduce current. Can dampen with thermal pads on inductors (advanced mod). PSU coil whine: swap to higher-quality unit." },
      { title: "Mechanical Noise", body: "HDD: check SMART reallocated sectors and pending counts. Click of death = imminent failure. Vibration dampening: rubber HDD mounts, fan gaskets, case feet." },
      { title: "Resonance", body: "Panel vibration at specific fan speeds: add dampening material or adjust fan curves to avoid resonant RPM ranges. Check for loose M.2 heatsink clips or drive bay rattles." }
    ],
    tip: { type: "info", text: "New clicking or grinding noises that weren't there before = something is failing. Don't ignore them — diagnose early before data loss." }
  }
};

async function showFixDetail(issue) {
  const guide = fixGuides[issue];
  const steps = guide[userLevel];
  setProgress(60);

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
        <button class="continue-btn secondary" onclick="showFixMenu()">← Other Issues</button>
        <button class="continue-btn success-btn" onclick="showCompletion('fix')">Done ✓</button>
      </div>
    </div>
  `, 'bot', 200);
}

// ============ COMPLETION SCREEN ============

async function showCompletion(type) {
  setProgress(100);

  const msgs = {
    building: {
      beginner: "You just built your first PC! That's a massive achievement. Welcome to the PC building community! 🎉",
      intermediate: "Build guide complete. Enjoy your new rig! Don't forget to run stress tests.",
      advanced: "Build checklist done. Time to tune and benchmark. Happy building."
    },
    upgrade: {
      beginner: "Great job upgrading your PC! That wasn't so hard, right? Enjoy the extra performance! 🎉",
      intermediate: "Upgrade guide complete. Verify everything is detected and run some benchmarks.",
      advanced: "Upgrade done. Verify detection, benchmark, and tune as needed."
    },
    fix: {
      beginner: "I hope that helped you fix the problem! If the issue continues, don't be afraid to ask for help at a local PC shop. 💪",
      intermediate: "Troubleshooting guide complete. If the issue persists, consider cross-testing components in another system.",
      advanced: "Diagnostic steps complete. Escalate to cross-system component testing or vendor RMA if unresolved."
    }
  };

  const msg = msgs[type][userLevel];

  await addMessage(`
    <div class="message-bubble" style="text-align:center;padding:40px 32px;">
      <div class="completion-icon">✅</div>
      <div class="completion-title">${lang("You Did It!", "All Done!", "Complete.")}</div>
      <div class="completion-text">${msg}</div>
      <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button class="continue-btn" onclick="showMainMenu()">
          ${lang("Help me with something else", "Back to Menu", "Main Menu")}
        </button>
        <button class="continue-btn secondary" onclick="goHome()">
          Start Over
        </button>
      </div>
    </div>
  `, 'bot', 300);
}

// ============ INIT ============
showWelcome();
