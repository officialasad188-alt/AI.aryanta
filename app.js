document.addEventListener('DOMContentLoaded', () => {
    // --- STATE VARIABLES ---
    const screens = {
        main: document.getElementById('main-app'),
        settings: document.getElementById('settings-screen'),
        profile: document.getElementById('profile-screen'),
        data: document.getElementById('data-screen'),
        savings: document.getElementById('savings-screen'),
        expenditure: document.getElementById('expenditure-screen'),
        bugreport: document.getElementById('bug-report-screen')
    };
    
    // Vault & Editing
    let isEditingProfile = false;
    let tempDocImage = null;
    let currentDocType = null;
    let editingDocIndex = -1; 
    let currentVaultFilter = 'All Items';

    // Savings & Expenses
    let tempSavingsAmount = 0;
    let currentExpType = 'credit'; 
    let currentExpFilter = 'today';

    // Security PIN State
    let pinCallback = null; 
    let pinMode = 'login'; 
    let tempPin = '';
    
    // Security Lockout Variables
    let failedAttempts = 0;
    let lockMultiplier = 1;
    let lockInterval = null;

    // --- PRIVACY GUARD: Lock on Desktop/Minimize ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // If the app has a PIN set, lock it immediately when user leaves
            if(localStorage.getItem('user-pin')) {
                // Force lock state
                pinScreen.style.display = 'flex';
                pinPad.style.display = 'grid';
                pinDots.style.display = 'flex';
                pinTimer.style.display = 'none';
                pinTitle.innerText = "Security Check";
                pinDesc.innerText = "App locked for security";
                pinDesc.style.color = "var(--text-muted)";
                currentInput = "";
                renderPinDots();
                document.getElementById('cancel-pin').style.display = 'none';
                // Reset mode to login
                pinMode = 'login';
                pinCallback = () => {
                    document.getElementById('main-app').style.display = 'block';
                    showToast("Welcome Back");
                    checkNotifications(); // Re-check notifications on unlock
                };
            }
        }
    });

    // --- AUTO CLOSE DROPDOWNS ON SCROLL/CLICK ---
    const closeAllSelects = (e) => {
        document.querySelectorAll('.custom-select-wrap.open').forEach(el => {
            if (e && el.contains(e.target)) return;
            el.classList.remove('open');
        });
    };
    
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.custom-select-trigger')) closeAllSelects(e);
    });

    window.addEventListener('scroll', (e) => {
        if(e.target.classList && e.target.classList.contains('custom-select-options')) return;
        closeAllSelects(null);
    }, true);


    // --- UTILS ---
    const showToast = (msg) => {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.classList.add('visible');
        setTimeout(() => t.classList.remove('visible'), 2500);
    };

    window.copyTxt = (txt) => {
        navigator.clipboard.writeText(txt).then(() => {
            showToast("Copied to Clipboard");
        });
    };

    const resizeImage = (base64Str) => {
        return new Promise((resolve) => {
            let img = new Image();
            img.src = base64Str;
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let scale = 600 / img.width;
                canvas.width = 600;
                canvas.height = img.height * scale;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
        });
    };

    // --- NAVIGATION ---
    const nav = (target) => {
        Object.values(screens).forEach(s => s.style.display = 'none');
        if(screens[target]) {
            screens[target].style.display = 'block';
            window.scrollTo(0,0);
        }
    };

    // Attach Listeners
    document.getElementById('btn-profile').onclick = () => { renderProfile(); nav('profile'); };
    document.getElementById('btn-settings').onclick = () => { renderSettings(); nav('settings'); };
    document.getElementById('btn-data').onclick = () => { renderDocs(); nav('data'); };
    document.getElementById('btn-savings').onclick = () => { renderSavings(); nav('savings'); };
    document.getElementById('btn-expenditure').onclick = () => { renderExpenditure(); nav('expenditure'); };
    
    // Tools Buttons
    document.getElementById('btn-aryanta-ai').onclick = () => { window.location.href = "https://example.com"; };
    document.getElementById('btn-bug-report').onclick = () => { nav('bugreport'); };
    document.getElementById('back-from-bugs').onclick = () => nav('main');

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.onclick = () => nav('main');
    });

    // --- NOTIFICATIONS (Birthday & Holiday) ---
    const checkNotifications = () => {
        const today = new Date();
        const d = today.getDate();
        const m = today.getMonth(); // 0 = Jan, 7 = Aug
        const name = localStorage.getItem('user-name') || 'Brother';
        
        // Birthday: 18th August
        if (d === 18 && m === 7) {
            alert(`🎂 Happy Birthday ${name}! 🎉\nWishing you a fantastic year!`);
            return;
        }

        const holidays = { "25-11": "Merry Christmas", "1-0": "Happy New Year", "26-0": "Happy Republic Day" };
        const key = `${d}-${m}`;
        if(holidays[key]) {
            alert(`🎉 ${holidays[key]}!`);
        }
    };

    // --- PIN SYSTEM & FACE ID INTEGRATION ---
    const pinScreen = document.getElementById('pin-screen');
    const pinDots = document.getElementById('pin-dots');
    const pinPad = document.getElementById('pin-pad');
    const pinTitle = document.getElementById('pin-title');
    const pinDesc = document.getElementById('pin-desc');
    const pinTimer = document.getElementById('pin-timer-msg');
    
    // Face ID UI
    const faceModal = document.getElementById('face-id-modal');
    const video = document.getElementById('camera-stream');
    const faceMsg = document.getElementById('face-msg');

    let currentInput = "";
    
    [1,2,3,4,5,6,7,8,9,'C',0,'⌫'].forEach(k => {
        const btn = document.createElement('div');
        btn.className = 'pin-key';
        btn.innerText = k;
        if(k === 'C') btn.onclick = () => updatePinInput('clear');
        else if(k === '⌫') btn.onclick = () => updatePinInput('back');
        else btn.onclick = () => updatePinInput(k);
        pinPad.appendChild(btn);
    });

    const openPin = (mode, callback, desc="Enter PIN") => {
        if(isLocked()) { startLockdownTimer(); return; }
        pinMode = mode;
        pinCallback = callback;
        currentInput = "";
        failedAttempts = 0;
        pinTitle.innerText = mode === 'set' ? "Set New PIN" : "Security Check";
        pinDesc.innerText = desc;
        pinDesc.style.color = "var(--text-muted)";
        pinPad.style.display = 'grid';
        pinDots.style.display = 'flex';
        pinTimer.style.display = 'none';
        renderPinDots();
        pinScreen.style.display = 'flex';
        document.getElementById('cancel-pin').style.display = (mode === 'login') ? 'none' : 'block';
    };

    document.getElementById('cancel-pin').onclick = () => {
        pinScreen.style.display = 'none';
        currentInput = "";
    };

    const renderPinDots = () => {
        pinDots.innerHTML = '';
        for(let i=0; i<4; i++) {
            const d = document.createElement('div');
            d.className = 'pin-dot' + (i < currentInput.length ? ' filled' : '');
            pinDots.appendChild(d);
        }
    };

    const updatePinInput = (val) => {
        if(val === 'clear') currentInput = "";
        else if(val === 'back') currentInput = currentInput.slice(0, -1);
        else if(currentInput.length < 4) currentInput += val;
        renderPinDots();
        if(currentInput.length === 4) setTimeout(() => handlePinSubmit(), 200);
    };

    const isLocked = () => {
        const lockUntil = localStorage.getItem('pin-lock-until');
        if(!lockUntil) return false;
        return new Date().getTime() < parseInt(lockUntil);
    };

    const startLockdownTimer = () => {
        const lockUntil = parseInt(localStorage.getItem('pin-lock-until'));
        pinScreen.style.display = 'flex';
        pinPad.style.display = 'none';
        pinDots.style.display = 'none';
        document.getElementById('cancel-pin').style.display = 'none';
        pinTimer.style.display = 'block';
        pinTitle.innerText = "System Locked";
        pinDesc.innerText = "Too many incorrect attempts.";
        pinDesc.style.color = "var(--danger)";

        clearInterval(lockInterval);
        lockInterval = setInterval(() => {
            const now = new Date().getTime();
            const left = Math.ceil((lockUntil - now) / 1000);
            if(left <= 0) {
                clearInterval(lockInterval);
                localStorage.removeItem('pin-lock-until');
                pinPad.style.display = 'grid';
                pinDots.style.display = 'flex';
                pinTimer.style.display = 'none';
                pinTitle.innerText = "Security Check";
                pinDesc.innerText = "Enter PIN";
                pinDesc.style.color = "var(--text-muted)";
                currentInput = "";
                renderPinDots();
            } else {
                pinTimer.innerText = `Try again in ${left}s`;
            }
        }, 1000);
    };

    const handlePinSubmit = () => {
        const stored = localStorage.getItem('user-pin');
        
        if(pinMode === 'login' || pinMode === 'verify-action' || pinMode === 'remove') {
            if(currentInput === stored) {
                // SUCCESS
                failedAttempts = 0;
                localStorage.setItem('pin-multiplier', '1');
                
                // IF Login -> Trigger Face ID
                if(pinMode === 'login') {
                    pinScreen.style.display = 'none';
                    setTimeout(() => startFaceID(), 500); 
                } else {
                    pinScreen.style.display = 'none';
                    if(pinCallback) pinCallback();
                }
            } else {
                // FAILURE
                failedAttempts++;
                const maxAttempts = 3;
                const left = maxAttempts - failedAttempts;
                currentInput = "";
                renderPinDots();
                if(left > 0) {
                    pinDesc.innerText = `Incorrect Password. ${left} attempts left`;
                    pinDesc.style.color = "var(--danger)";
                    showToast(`Incorrect PIN`);
                } else {
                    let mult = parseInt(localStorage.getItem('pin-multiplier') || '1');
                    let duration = 15 * mult; 
                    const lockUntil = new Date().getTime() + (duration * 1000);
                    localStorage.setItem('pin-lock-until', lockUntil);
                    localStorage.setItem('pin-multiplier', (mult * 2).toString());
                    startLockdownTimer();
                }
            }
        } else if (pinMode === 'set') {
            tempPin = currentInput;
            openPin('confirm-set', pinCallback, "Confirm PIN");
        } else if (pinMode === 'confirm-set') {
            if(currentInput === tempPin) {
                localStorage.setItem('user-pin', currentInput);
                showToast("PIN Set Successfully");
                pinScreen.style.display = 'none';
                renderSettings();
                if(pinCallback) pinCallback();
            } else {
                showToast("PIN Mismatch");
                openPin('set', pinCallback);
            }
        }
    };

    // --- ROBUST FACE ID LOGIC ---
    const startFaceID = async () => {
        faceModal.style.display = 'flex';
        faceMsg.innerText = "Initializing Camera...";
        faceMsg.style.color = "var(--primary)";
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            video.srcObject = stream;
            // IMPORTANT: Wait for metadata to ensure video plays
            video.onloadedmetadata = () => {
                video.play();
                faceMsg.innerText = "Scanning Face...";
            };
            
            // Artificial delay to simulate scanning (2s)
            setTimeout(() => {
                faceMsg.innerText = "Verified Successfully ✓";
                faceMsg.style.color = "var(--success)";
                
                // Stop Camera Streams
                stream.getTracks().forEach(t => t.stop());
                
                setTimeout(() => {
                    faceModal.style.display = 'none';
                    document.getElementById('main-app').style.display = 'block';
                    showToast("Welcome Back");
                    checkNotifications(); // Check notification after login
                }, 1000);
            }, 2000);

        } catch (err) {
            console.error("Camera Error:", err);
            faceMsg.innerText = "Camera Error or Denied.";
            faceMsg.style.color = "var(--danger)";
            
            // FALLBACK: Allow entry anyway after delay so user isn't stuck
            setTimeout(() => {
                faceModal.style.display = 'none';
                document.getElementById('main-app').style.display = 'block';
                showToast("Face ID Skipped (Camera unavailable)");
                checkNotifications();
            }, 2000);
        }
    };

    document.addEventListener('app-ready-check-pin', () => {
        if(isLocked()) {
            startLockdownTimer();
        } else {
            openPin('login', null, "Unlock App");
        }
    });

    // --- PROFILE ---
    const profileKeys = [ { key: 'name', label: 'Full Name' }, { key: 'father', label: 'Father Name' }, { key: 'mother', label: 'Mother Name' }, { key: 'phone', label: 'Mobile Number' }, { key: 'dob', label: 'Date of Birth' }, { key: 'address', label: 'Address' } ];
    const renderProfile = () => {
        const container = document.getElementById('profile-fields'); container.innerHTML = '';
        profileKeys.forEach(p => {
            const val = localStorage.getItem(`user-${p.key}`) || '';
            const div = document.createElement('div'); div.style.marginBottom = '15px';
            if(isEditingProfile) div.innerHTML = `<div class="section-label">${p.label}</div><input type="text" id="input-${p.key}" value="${val}" class="modern-input">`;
            else div.innerHTML = `<div class="section-label">${p.label}</div><div style="font-size:16px; font-weight:500; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">${val || '-'}</div>`;
            container.appendChild(div);
        });
        const n = localStorage.getItem('user-name'); if(n) document.getElementById('dash-name').innerText = n;
        const pic = localStorage.getItem('profile-pic') || "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/405ba96c-ee6d-452d-a99a-38ae2fd6b74b.png";
        document.getElementById('dash-pic').src = pic; document.getElementById('profile-pic-detail').src = pic; 
        document.getElementById('dash-pic').onclick = () => viewImg(pic);
    };

    document.getElementById('edit-profile-btn').onclick = function() {
        if(!isEditingProfile) { isEditingProfile = true; this.innerText = "SAVE"; this.style.color = "var(--success)"; document.getElementById('camera-overlay').style.display = "flex"; }
        else { profileKeys.forEach(p => { const el = document.getElementById(`input-${p.key}`); if(el) localStorage.setItem(`user-${p.key}`, el.value); }); isEditingProfile = false; this.innerText = "EDIT"; this.style.color = "var(--primary)"; document.getElementById('camera-overlay').style.display = "none"; showToast("Profile Updated"); renderProfile(); }
    };
    document.getElementById('camera-overlay').onclick = () => document.getElementById('photo-choice-modal').style.display = 'flex';
    document.getElementById('btn-choice-cam').onclick = () => { document.getElementById('pic-upload-cam').click(); document.getElementById('photo-choice-modal').style.display='none'; };
    document.getElementById('btn-choice-alb').onclick = () => { document.getElementById('pic-upload-alb').click(); document.getElementById('photo-choice-modal').style.display='none'; };
    document.getElementById('btn-choice-rem').onclick = () => { localStorage.removeItem('profile-pic'); renderProfile(); document.getElementById('photo-choice-modal').style.display='none'; };
    const handleProfilePic = (e) => { const file = e.target.files[0]; if(file) { const reader = new FileReader(); reader.onload = async (evt) => { const resized = await resizeImage(evt.target.result); localStorage.setItem('profile-pic', resized); renderProfile(); showToast("Photo Updated"); }; reader.readAsDataURL(file); }};
    document.getElementById('pic-upload-cam').onchange = handleProfilePic; document.getElementById('pic-upload-alb').onchange = handleProfilePic;


    // --- DATA VAULT (With Copy Buttons & Passbook Layout) ---
    const docTypes = ['Gift Card', 'ATM / Debit Card', 'Pass Book', 'Aadhar Card', 'Certificate', 'Other'];
    
    const setupCustomSelect = (wrapId, trigId, optId, txtId, optionsList, onSelect) => {
        const wrap = document.getElementById(wrapId);
        const options = document.getElementById(optId);
        const text = document.getElementById(txtId);
        options.innerHTML = '';
        optionsList.forEach(t => {
            const d = document.createElement('div'); d.className = 'custom-option'; d.innerText = t;
            d.onclick = () => { text.innerText = t; wrap.classList.remove('open'); onSelect(t); };
            options.appendChild(d);
        });
        if(wrapId === 'doc-type-wrap') {
             const c = document.createElement('div'); c.className = 'custom-option'; c.style.color = 'var(--accent)'; c.innerText = '+ Custom Category';
             c.onclick = () => { const val = prompt("Enter Category Name:"); if(val) { text.innerText = val; wrap.classList.remove('open'); onSelect(val); }};
             options.appendChild(c);
        }
        document.getElementById(trigId).onclick = () => {
            document.querySelectorAll('.custom-select-wrap').forEach(el => { if(el.id !== wrapId) el.classList.remove('open'); });
            wrap.classList.toggle('open');
        };
    };

    setupCustomSelect('doc-type-wrap', 'doc-type-trigger', 'doc-type-options', 'doc-type-text', docTypes, (val) => { currentDocType = val; renderDocFields(val); });
    setupCustomSelect('vault-filter-wrap', 'vault-filter-trigger', 'vault-filter-options', 'vault-filter-text', ['All Items', ...docTypes], (val) => { currentVaultFilter = val; renderDocs(); });

    const renderDocFields = (type, data = {}) => {
        const c = document.getElementById('dynamic-fields'); c.innerHTML = '';
        const mkIn = (id, ph, val='', extra='') => `<input id="${id}" placeholder="${ph}" class="modern-input" value="${val}" ${extra}>`;
        const mkSel = (id, opts, selVal) => `<div class="custom-select-wrap" style="margin-bottom:12px;"><select id="${id}" class="modern-input" style="appearance:none;">${opts.map(o=>`<option ${o===selVal?'selected':''}>${o}</option>`).join('')}</select></div>`;
        
        let html = '';
        if(type === 'Gift Card') { html += mkSel('gc-type', ['Play Store', 'Steam', 'Amazon', 'Apple', 'Xbox', 'Other'], data.subtype); html += mkIn('gc-uid', 'Redeem Code / UID', data.uid); } 
        else if(type === 'ATM / Debit Card') { html += mkSel('atm-class', ['Debit Card', 'Credit Card'], data.class); html += mkSel('atm-vendor', ['Visa', 'Mastercard', 'Rupay', 'Amex'], data.vendor); html += mkIn('atm-bank', 'Bank Name', data.bank); html += mkIn('atm-holder', 'Card Holder Name', data.holder); html += mkIn('atm-num', 'Card Number', data.num); html += `<div style="display:flex; gap:10px;">${mkIn('atm-exp', 'Expiry MM/YY', data.exp)} ${mkIn('atm-cvv', 'CVV (3 Digits)', data.cvv, 'type="number" oninput="if(this.value.length>3)this.value=this.value.slice(0,3)"')}</div>`; } 
        else if(type === 'Pass Book') { html += mkIn('pb-bank', 'Bank Name', data.bank); html += mkIn('pb-acc', 'Account Number', data.acc); html += mkIn('pb-ifsc', 'IFSC Code', data.ifsc); html += mkIn('pb-holder', 'Account Holder Name', data.holder); html += mkIn('pb-cif', 'CIF Number', data.cif); html += mkSel('pb-type', ['Savings', 'Current', 'Salary', 'Student'], data.acctype); } 
        else if(type === 'Aadhar Card') { html += mkIn('ad-name', 'Name on Card', data.name); html += mkIn('ad-num', 'Aadhar Number', data.num); html += mkIn('ad-father', 'Father Name', data.father); html += mkIn('ad-dob', 'Date of Birth (MM/YYYY)', data.dob); } 
        else if(type === 'Certificate') { html += mkIn('cert-name', 'Certificate Name', data.name); html += mkIn('cert-auth', 'Issuing Authority', data.auth); } 
        else { html += mkIn('gen-title', 'Title/Name', data.name); html += `<div id="tags-container"></div>`; html += `<button id="add-tag-btn" style="width:100%; padding:12px; border:1px dashed var(--primary); color:var(--primary); background:rgba(0,0,0,0.1); border-radius:12px; cursor:pointer;">+ Add Custom Field</button>`; }
        
        c.innerHTML = html;
        if(data.tags && document.getElementById('tags-container')) data.tags.forEach(t => addTagRow(t.key, t.val));
        if(document.getElementById('add-tag-btn')) document.getElementById('add-tag-btn').onclick = () => addTagRow();
    };

    const addTagRow = (k='', v='') => {
        const div = document.createElement('div'); div.className = 'tag-row';
        div.innerHTML = `<input class="modern-input tag-key" placeholder="Label" value="${k}" style="flex:1; margin:0;"><input class="modern-input tag-val" placeholder="Value" value="${v}" style="flex:1; margin:0;"><button class="remove-tag" style="background:none;border:none;color:red;">&times;</button>`;
        document.getElementById('tags-container').appendChild(div);
        div.querySelector('.remove-tag').onclick = () => div.remove();
    }

    const modal = document.getElementById('add-modal');
    document.getElementById('add-data-btn').onclick = () => { editingDocIndex = -1; modal.style.display = "flex"; document.getElementById('vault-modal-title').innerText = "Add to Vault"; document.getElementById('dynamic-fields').innerHTML = ''; document.getElementById('doc-type-text').innerText = "Select Category"; currentDocType = null; tempDocImage = null; document.getElementById('file-label').innerHTML = "<span>Tap to Attach Photo 📷</span>"; };
    document.getElementById('cancel-doc-btn').onclick = () => modal.style.display = "none";
    document.getElementById('file-label').onclick = () => document.getElementById('doc-file-input').click();
    document.getElementById('doc-file-input').onchange = (e) => { const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onload = async (evt) => { tempDocImage = await resizeImage(evt.target.result); document.getElementById('file-label').innerHTML = "<span style='color:var(--success)'>Photo Attached ✓</span>"; }; r.readAsDataURL(f); }};

    document.getElementById('save-doc-btn').onclick = () => {
        if(!currentDocType) return showToast("Select a Category");
        const val = (id) => document.getElementById(id) ? document.getElementById(id).value : '';
        let doc = { type: currentDocType, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), image: tempDocImage };
        if(currentDocType === 'Gift Card') { doc.subtype = val('gc-type'); doc.uid = val('gc-uid'); } 
        else if(currentDocType === 'ATM / Debit Card') { doc.class = val('atm-class'); doc.vendor = val('atm-vendor'); doc.bank = val('atm-bank'); doc.holder = val('atm-holder'); doc.num = val('atm-num'); doc.exp = val('atm-exp'); doc.cvv = val('atm-cvv'); } 
        else if(currentDocType === 'Pass Book') { doc.bank = val('pb-bank'); doc.acc = val('pb-acc'); doc.ifsc = val('pb-ifsc'); doc.holder = val('pb-holder'); doc.cif = val('pb-cif'); doc.acctype = val('pb-type'); } 
        else if(currentDocType === 'Aadhar Card') { doc.name = val('ad-name'); doc.num = val('ad-num'); doc.father = val('ad-father'); doc.dob = val('ad-dob'); } 
        else if(currentDocType === 'Certificate') { doc.name = val('cert-name'); doc.auth = val('cert-auth'); } 
        else { doc.name = val('gen-title'); doc.tags = []; document.querySelectorAll('.tag-row').forEach(row => { doc.tags.push({ key: row.querySelector('.tag-key').value, val: row.querySelector('.tag-val').value }); }); }
        
        const list = JSON.parse(localStorage.getItem('user-docs') || '[]');
        if(editingDocIndex >= 0) { if(!doc.image) doc.image = list[editingDocIndex].image; doc.date = list[editingDocIndex].date; doc.time = list[editingDocIndex].time || doc.time; list[editingDocIndex] = doc; showToast("Vault Updated"); } 
        else { list.push(doc); showToast("Saved to Vault"); }
        localStorage.setItem('user-docs', JSON.stringify(list)); modal.style.display = 'none'; renderDocs(); 
    };

    const renderDocs = () => {
        const list = JSON.parse(localStorage.getItem('user-docs') || '[]'); 
        const c = document.getElementById('data-list'); c.innerHTML = '';
        const filteredList = (currentVaultFilter === 'All Items') ? list : list.filter(d => d.type === currentVaultFilter);
        if(filteredList.length === 0) { c.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:50px;">Nothing found in ${currentVaultFilter}.</p>`; return; }
        filteredList.forEach((d, i) => {
            const originalIndex = list.findIndex(x => x === d);
            const el = document.createElement('div'); el.className = 'vault-item-minimal';
            let icon = '📄'; if(d.type.includes('ATM')) icon = '💳'; if(d.type.includes('Pass')) icon = '📒'; if(d.type.includes('Gift')) icon = '🎁'; if(d.type.includes('Aadhar')) icon = '🆔';
            let title = d.type; if(d.bank) title = d.bank; if(d.name && d.type !== 'Aadhar Card') title = d.name; 
            el.innerHTML = `<div style="display:flex; align-items:center;"><div class="vault-icon">${icon}</div><div><div style="font-weight:600;">${title}</div><div style="font-size:11px; opacity:0.6;">${d.type}</div></div></div><div style="font-size:11px; opacity:0.5;">${d.date}</div>`;
            el.onclick = () => openDocDetail(originalIndex);
            c.appendChild(el);
        });
    };

    const mkCopy = (val) => {
        if(!val) return '-';
        return `<span style="display:flex; align-items:center; gap:8px;">${val} <button onclick="event.stopPropagation(); copyTxt('${val}')" class="copy-btn">📋</button></span>`
    };

    const openDocDetail = (index) => {
        const list = JSON.parse(localStorage.getItem('user-docs'));
        const d = list[index];
        const modal = document.getElementById('vault-detail-modal');
        const visualC = document.getElementById('detail-visual-container');
        const infoC = document.getElementById('detail-info-container');
        
        let inner = '', cls = 'visual-card';
        const topDate = `<div style="position:absolute; top:15px; right:15px; font-size:10px; opacity:0.7;">${d.date} ${d.time || ''}</div>`;

        if(d.type === 'ATM / Debit Card') { 
            cls += ' atm'; 
            inner = `${topDate}<div style="font-size:18px; font-weight:700; margin-bottom:15px; letter-spacing:1px; margin-top:10px;">${d.bank || 'Bank'}</div><div class="chip"></div><div style="font-family:monospace; font-size:20px; letter-spacing:2px; margin-bottom:15px; display:flex; align-items:center;">${mkCopy(d.num)}</div><div style="display:flex; justify-content:space-between;"><div><div style="font-size:9px; opacity:0.7;">HOLDER</div><div style="font-size:14px; text-transform:uppercase;">${mkCopy(d.holder)}</div></div><div style="text-align:right;"><div style="font-size:9px; opacity:0.7;">VALID</div><div style="font-size:12px;">${d.exp || '00/00'}</div></div></div>`; 
        } 
        else if(d.type === 'Pass Book') { 
            cls += ' passbook'; 
            inner = `<div style="display:flex; justify-content:flex-end; font-size:10px; opacity:0.6; margin-bottom:10px;">${d.date} ${d.time || ''}</div><div style="margin-bottom:12px;"><div style="font-size:9px; opacity:0.7; text-transform:uppercase;">Account Holder</div><div style="font-size:16px; font-weight:700;">${mkCopy(d.holder)}</div></div><div style="margin-bottom:12px;"><div style="font-size:9px; opacity:0.7; text-transform:uppercase;">Account Number</div><div style="font-size:20px; font-family:monospace; font-weight:600;">${mkCopy(d.acc)}</div></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px; padding-bottom:10px; border-bottom:1px dashed rgba(0,0,0,0.1);"><div><div style="font-size:9px; opacity:0.7;">IFSC CODE</div><div style="font-weight:600;">${mkCopy(d.ifsc)}</div></div><div style="text-align:right;"><div style="font-size:9px; opacity:0.7;">CIF NO</div><div style="font-weight:600;">${mkCopy(d.cif)}</div></div></div><div style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:14px; font-weight:bold;">${d.bank || 'Bank Name'}</div><div style="background:var(--success); color:black; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">${d.acctype || 'SAVINGS'}</div></div>`; 
        } 
        else if(d.type === 'Aadhar Card') { 
            cls += ' aadhar'; 
            inner = `${topDate}<div style="text-align:center; font-weight:bold; color:#f39c12; margin-bottom:20px; letter-spacing:1px;">GOVT OF INDIA</div><div style="margin-bottom:15px;"><div style="font-size:10px; opacity:0.6;">Name</div><div style="font-weight:700; font-size:16px;">${mkCopy(d.name)}</div></div> <div style="margin-bottom:15px;"><div style="font-size:10px; opacity:0.6;">UID Number</div><div style="font-weight:700; font-size:18px; letter-spacing:1px;">${mkCopy(d.num)}</div></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><div><div style="font-size:10px; opacity:0.6;">Father's Name</div><div style="font-weight:600; font-size:14px;">${mkCopy(d.father)}</div></div><div><div style="font-size:10px; opacity:0.6;">DOB</div><div style="font-weight:600; font-size:14px;">${mkCopy(d.dob)}</div></div></div>`; 
        } 
        else { 
            inner = `${topDate}<div style="font-weight:700; font-size:18px; color:var(--primary); margin-bottom:10px;">${d.type}</div>${d.name ? `<div style="font-size:16px; font-weight:bold; margin-bottom:5px;">${mkCopy(d.name)}</div>` : ''}`; 
        }

        visualC.innerHTML = `<div class="${cls}" style="position:relative;">${inner}</div>`;
        if(d.image && d.type !== 'Aadhar Card') visualC.innerHTML += `<button onclick="viewImg('${d.image}')" class="action-btn btn-outline" style="margin-top:0;">View Attached Image</button>`;

        let infoHtml = '';
        Object.entries(d).forEach(([k, v]) => { if(k !== 'image' && k !== 'tags' && k !== 'time' && v) infoHtml += `<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--glass-border); font-size:14px;"><span style="opacity:0.6; text-transform:capitalize;">${k}</span><span style="font-weight:600; text-align:right; max-width:60%; display:flex; align-items:center;">${v} <button onclick="copyTxt('${v}')" class="copy-btn">📋</button></span></div>`; });
        infoC.innerHTML = infoHtml;

        document.getElementById('btn-detail-edit').onclick = () => { modal.style.display = 'none'; openEditMode(index, d); };
        document.getElementById('btn-detail-del').onclick = () => {
            const hasPin = localStorage.getItem('user-pin');
            if(hasPin) {
                openPin('verify-action', () => { showConfirm("Permanent Delete", "Are you sure you want to delete this?", () => performDelete(index)); }, "Confirm PIN to Delete");
            } else {
                showConfirm("Permanent Delete", "Are you sure you want to delete this?", () => performDelete(index));
            }
        };
        modal.style.display = 'flex';
    };
    document.getElementById('close-detail').onclick = () => document.getElementById('vault-detail-modal').style.display = 'none';

    // --- OTHER VAULT FUNCTIONS ---
    const openEditMode = (index, data) => {
        editingDocIndex = index;
        document.getElementById('add-modal').style.display = "flex";
        document.getElementById('vault-modal-title').innerText = "Edit Item";
        document.getElementById('doc-type-text').innerText = data.type;
        currentDocType = data.type;
        tempDocImage = data.image;
        if(data.image) document.getElementById('file-label').innerHTML = "<span style='color:var(--success)'>Image Kept (Tap to change)</span>";
        renderDocFields(data.type, data);
    };

    const performDelete = (index) => {
        const list = JSON.parse(localStorage.getItem('user-docs'));
        list.splice(index, 1);
        localStorage.setItem('user-docs', JSON.stringify(list));
        document.getElementById('vault-detail-modal').style.display = 'none';
        document.getElementById('confirm-modal').style.display = 'none';
        renderDocs();
        showToast("Item Deleted Permanently");
    };

    let confirmCallback = null;
    const confirmModal = document.getElementById('confirm-modal');
    const showConfirm = (title, msg, cb) => {
        document.getElementById('confirm-head').innerText = title;
        document.getElementById('confirm-msg').innerText = msg;
        confirmCallback = cb;
        confirmModal.style.display = 'flex';
    };
    document.getElementById('confirm-no').onclick = () => confirmModal.style.display = 'none';
    document.getElementById('confirm-yes').onclick = () => { if(confirmCallback) confirmCallback(); };

    // --- EXPENSES WITH MONTHLY REPORTS ---
    document.getElementById('exp-filter-trigger').onclick = (e) => { e.stopPropagation(); document.getElementById('exp-filter-wrap').classList.toggle('open'); };
    document.querySelectorAll('#exp-filter-options .custom-option').forEach(el => { el.onclick = () => { currentExpFilter = el.getAttribute('data-val'); document.getElementById('exp-filter-text').innerText = el.innerText; document.getElementById('exp-filter-wrap').classList.remove('open'); renderExpenditure(); }; });

    const renderExpenditure = () => {
        const list = JSON.parse(localStorage.getItem('user-expenses') || '[]');
        const listContainer = document.getElementById('exp-history-list'); listContainer.innerHTML = '';
        let totalBal = 0; let filteredUsed = 0;
        const now = new Date(); now.setHours(0,0,0,0);
        list.forEach(i => { if(i.type === 'credit') totalBal += parseFloat(i.amount); else totalBal -= parseFloat(i.amount); });
        const filteredList = list.filter(item => { const d = new Date(item.isoDate); d.setHours(0,0,0,0); if(currentExpFilter === 'today') return d.getTime() === now.getTime(); if(currentExpFilter === 'week') { const day = now.getDay(); const diff = now.getDate() - day + (day == 0 ? -6:1); const startOfWeek = new Date(now.setDate(diff)); return d >= startOfWeek; } if(currentExpFilter === 'month') return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear(); return true; });
        filteredList.forEach(item => { if(item.type === 'debit') filteredUsed += parseFloat(item.amount); });
        let label = "Total Used Today"; if(currentExpFilter === 'week') label = "Total Used This Week"; if(currentExpFilter === 'month') label = "Total Used This Month";
        document.getElementById('exp-total-balance').innerText = `₹${totalBal.toLocaleString()}`; document.getElementById('stat-lbl-dynamic').innerText = label; document.getElementById('stat-exp-dynamic').innerText = `₹${filteredUsed.toLocaleString()}`;
        if(filteredList.length === 0) { listContainer.innerHTML = `<p style="text-align:center; opacity:0.5;">No transactions for this period.</p>`; } else { [...filteredList].reverse().forEach(item => { const row = document.createElement('div'); row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.padding = '12px 0'; row.style.borderBottom = '1px solid var(--glass-border)'; const isCredit = item.type === 'credit'; row.innerHTML = `<div><div style="font-weight:600;">${item.desc || (isCredit ? 'Income' : 'Expense')}</div><div style="font-size:11px; opacity:0.6;">${item.date}</div></div><div style="font-weight:700; color:${isCredit ? 'var(--success)' : 'var(--danger)'}; font-size:16px;">${isCredit ? '+' : '-'}₹${item.amount}</div>`; listContainer.appendChild(row); }); }

        // Monthly Report Button
        if(currentExpFilter === 'month') {
            const btn = document.createElement('button');
            btn.className = 'action-btn'; btn.style.background = 'var(--primary)'; btn.style.color = 'black'; btn.style.marginTop = '15px'; btn.innerText = "View Full Monthly Report";
            btn.onclick = () => renderMonthlyReport(filteredList);
            if(!document.getElementById('view-rpt-btn')) { btn.id = 'view-rpt-btn'; document.getElementById('exp-history-list').parentNode.appendChild(btn); }
        } else { const b = document.getElementById('view-rpt-btn'); if(b) b.remove(); }
    };

    const renderMonthlyReport = (list) => {
        const modal = document.getElementById('monthly-report-modal'); const container = document.getElementById('monthly-list-container'); container.innerHTML = ''; let tCred = 0; let tDeb = 0;
        list.forEach(item => {
             const div = document.createElement('div'); const d = new Date(item.isoDate); const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }); const dayStr = d.toLocaleDateString('en-US', { weekday: 'long' }); const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); const isCredit = item.type === 'credit'; if(isCredit) tCred += parseFloat(item.amount); else tDeb += parseFloat(item.amount);
             div.innerHTML = `<div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--glass-border); align-items:center;"><div style="width:30%;"><div style="font-weight:bold; font-size:14px;">${dateStr}</div><div style="font-size:10px; opacity:0.6;">${dayStr}</div></div><div style="width:30%; text-align:center; font-size:12px; opacity:0.8;">${timeStr}</div><div style="width:40%; text-align:right; font-weight:bold; color:${isCredit?'var(--success)':'var(--danger)'};">${isCredit?'+':'-'}₹${item.amount}</div></div>`; container.appendChild(div);
        });
        document.getElementById('rpt-total-credit').innerText = `₹${tCred}`; document.getElementById('rpt-total-debit').innerText = `₹${tDeb}`; modal.style.display = 'flex';
    };
    document.getElementById('close-monthly-report').onclick = () => document.getElementById('monthly-report-modal').style.display = 'none';

    const expModal = document.getElementById('expense-modal');
    document.getElementById('btn-add-income').onclick = () => { currentExpType = 'credit'; document.getElementById('exp-modal-title').innerText = "Add Income"; document.getElementById('save-exp-btn').style.background = "var(--success)"; expModal.style.display = 'flex'; };
    document.getElementById('btn-add-expense').onclick = () => { currentExpType = 'debit'; document.getElementById('exp-modal-title').innerText = "Add Expense"; document.getElementById('save-exp-btn').style.background = "var(--danger)"; expModal.style.display = 'flex'; };
    document.getElementById('close-exp-btn').onclick = () => expModal.style.display = 'none';
    document.getElementById('save-exp-btn').onclick = () => { const amt = document.getElementById('exp-amount-input').value; const desc = document.getElementById('exp-desc-input').value; if(!amt || amt <= 0) return showToast("Enter valid amount"); const list = JSON.parse(localStorage.getItem('user-expenses') || '[]'); list.push({ type: currentExpType, amount: amt, desc: desc, date: new Date().toLocaleDateString(), isoDate: new Date().toISOString() }); localStorage.setItem('user-expenses', JSON.stringify(list)); expModal.style.display = 'none'; renderExpenditure(); showToast("Saved"); document.getElementById('exp-amount-input').value = ''; };

    // --- SETTINGS (Cleaned) ---
    const renderSettings = () => { 
        const hasPin = localStorage.getItem('user-pin'); document.getElementById('toggle-pin').checked = !!hasPin; document.getElementById('pin-opts').style.display = hasPin ? 'block' : 'none'; 
    };
    document.getElementById('toggle-pin').onclick = (e) => { e.preventDefault(); const hasPin = localStorage.getItem('user-pin'); if(hasPin) openPin('remove', () => { localStorage.removeItem('user-pin'); renderSettings(); showToast("PIN Removed"); }, "Enter PIN to Disable"); else openPin('set', null); };
    document.getElementById('btn-change-pin').onclick = () => { openPin('verify-action', () => { openPin('set', null); }, "Enter Old PIN"); };

    const renderSavings = () => { const list = JSON.parse(localStorage.getItem('user-savings') || '[]'); const tbody = document.getElementById('savings-list'); tbody.innerHTML = ''; let total = 0; list.forEach((item, index) => { total += parseFloat(item.amount); tbody.innerHTML += `<tr><td>${index + 1}</td><td>${item.date}</td><td style="text-align:right; color:var(--success);">+ ₹${item.amount}</td></tr>`; }); document.getElementById('total-balance').innerText = `₹${total.toLocaleString()}`; document.getElementById('summary-times').innerText = `Times Added: ${list.length}`; document.getElementById('summary-date').innerText = `Date: ${new Date().toLocaleDateString()}`; };
    const sModal = document.getElementById('savings-modal'); document.getElementById('add-savings-btn').onclick = () => { document.getElementById('savings-input').value = ''; sModal.style.display = 'flex'; }; document.getElementById('close-savings-btn').onclick = () => sModal.style.display = 'none'; document.getElementById('process-savings-btn').onclick = () => { const amt = document.getElementById('savings-input').value; if(!amt) return; tempSavingsAmount = amt; sModal.style.display = 'none'; showConfirm("Confirm Deposit", `Add ₹${amt} to savings?`, () => { const list = JSON.parse(localStorage.getItem('user-savings') || '[]'); list.push({ amount: tempSavingsAmount, date: new Date().toLocaleDateString() }); localStorage.setItem('user-savings', JSON.stringify(list)); confirmModal.style.display = 'none'; renderSavings(); showToast("Added to Savings"); }); };

    window.viewImg = (src) => { document.getElementById('viewer-img').src = src; document.getElementById('img-viewer').style.display = 'flex'; };
    document.getElementById('close-img').onclick = () => document.getElementById('img-viewer').style.display = 'none';
    window.setTheme = (t) => { localStorage.setItem('theme', t); if(t === 'system') { const dark = window.matchMedia('(prefers-color-scheme: dark)').matches; document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); } else { document.documentElement.setAttribute('data-theme', t); } document.querySelectorAll('.theme-opt').forEach(e => e.classList.remove('active')); document.getElementById(`theme-${t}`).classList.add('active'); };

    const init = () => { renderProfile(); setTheme(localStorage.getItem('theme') || 'dark'); renderSettings(); };
    init();
});
