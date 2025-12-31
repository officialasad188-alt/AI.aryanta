document.addEventListener('DOMContentLoaded', () => {
    // --- STATE VARIABLES ---
    const screens = {
        main: document.getElementById('main-app'),
        settings: document.getElementById('settings-screen'),
        profile: document.getElementById('profile-screen'),
        data: document.getElementById('data-screen'),
        savings: document.getElementById('savings-screen'),
        expenditure: document.getElementById('expenditure-screen')
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
    window.addEventListener('scroll', () => closeAllSelects(null), true);


    // --- UTILS ---
    const showToast = (msg) => {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.classList.add('visible');
        setTimeout(() => t.classList.remove('visible'), 2500);
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
    
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.onclick = () => nav('main');
    });

    // --- PIN SYSTEM ---
    const pinScreen = document.getElementById('pin-screen');
    const pinDots = document.getElementById('pin-dots');
    const pinPad = document.getElementById('pin-pad');
    const pinTitle = document.getElementById('pin-title');
    const pinDesc = document.getElementById('pin-desc');
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
        pinMode = mode;
        pinCallback = callback;
        currentInput = "";
        pinTitle.innerText = mode === 'set' ? "Set New PIN" : "Security Check";
        pinDesc.innerText = desc;
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

    const handlePinSubmit = () => {
        const stored = localStorage.getItem('user-pin');
        if(pinMode === 'login' || pinMode === 'verify-action' || pinMode === 'remove') {
            if(currentInput === stored) {
                pinScreen.style.display = 'none';
                if(pinCallback) pinCallback();
            } else {
                showToast("Incorrect PIN");
                currentInput = "";
                renderPinDots();
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

    document.addEventListener('app-ready-check-pin', () => {
        openPin('login', () => {
            document.getElementById('main-app').style.display = 'block';
            showToast("Welcome Back");
        }, "Unlock App");
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


    // --- DATA VAULT ---
    const docTypes = ['Gift Card', 'ATM / Debit Card', 'Pass Book', 'Aadhar Card', 'Certificate', 'Other'];
    
    // Custom Select Builder
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
        
        // Specific logic for Add Doc type (Add 'Other' input)
        if(wrapId === 'doc-type-wrap') {
             const c = document.createElement('div'); c.className = 'custom-option'; c.style.color = 'var(--accent)'; c.innerText = '+ Custom Category';
             c.onclick = () => { const val = prompt("Enter Category Name:"); if(val) { text.innerText = val; wrap.classList.remove('open'); onSelect(val); }};
             options.appendChild(c);
        }

        document.getElementById(trigId).onclick = () => {
            // Close others first
            document.querySelectorAll('.custom-select-wrap').forEach(el => { if(el.id !== wrapId) el.classList.remove('open'); });
            wrap.classList.toggle('open');
        };
    };

    // Setup Add Modal Select
    setupCustomSelect('doc-type-wrap', 'doc-type-trigger', 'doc-type-options', 'doc-type-text', docTypes, (val) => {
        currentDocType = val; renderDocFields(val);
    });

    // Setup Vault Filter Select
    setupCustomSelect('vault-filter-wrap', 'vault-filter-trigger', 'vault-filter-options', 'vault-filter-text', ['All Items', ...docTypes], (val) => {
        currentVaultFilter = val; renderDocs();
    });

    const renderDocFields = (type, data = {}) => {
        const c = document.getElementById('dynamic-fields'); c.innerHTML = '';
        const mkIn = (id, ph, val='') => `<input id="${id}" placeholder="${ph}" class="modern-input" value="${val}">`;
        const mkSel = (id, opts, selVal) => `<div class="custom-select-wrap" style="margin-bottom:12px;"><select id="${id}" class="modern-input" style="appearance:none;">${opts.map(o=>`<option ${o===selVal?'selected':''}>${o}</option>`).join('')}</select></div>`;
        
        let html = '';
        if(type === 'Gift Card') { html += mkSel('gc-type', ['Play Store', 'Steam', 'Amazon', 'Apple', 'Xbox', 'Other'], data.subtype); html += mkIn('gc-uid', 'Redeem Code / UID', data.uid); } 
        else if(type === 'ATM / Debit Card') { html += mkSel('atm-class', ['Debit Card', 'Credit Card'], data.class); html += mkSel('atm-vendor', ['Visa', 'Mastercard', 'Rupay', 'Amex'], data.vendor); html += mkIn('atm-bank', 'Bank Name', data.bank); html += mkIn('atm-holder', 'Card Holder Name', data.holder); html += mkIn('atm-num', 'Card Number', data.num); html += `<div style="display:flex; gap:10px;">${mkIn('atm-exp', 'Expiry MM/YY', data.exp)} ${mkIn('atm-cvv', 'CVV', data.cvv)}</div>`; } 
        else if(type === 'Pass Book') { html += mkIn('pb-bank', 'Bank Name', data.bank); html += mkIn('pb-acc', 'Account Number', data.acc); html += mkIn('pb-ifsc', 'IFSC Code', data.ifsc); html += mkIn('pb-holder', 'Account Holder Name', data.holder); html += mkIn('pb-cif', 'CIF Number', data.cif); html += mkSel('pb-type', ['Savings', 'Current', 'Salary', 'Student'], data.acctype); } 
        else if(type === 'Aadhar Card') { html += mkIn('ad-name', 'Name on Card', data.name); html += mkIn('ad-num', 'Aadhar Number', data.num); html += mkIn('ad-father', 'Father Name', data.father); html += mkIn('ad-addr', 'Full Address', data.addr); } 
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
    document.getElementById('add-data-btn').onclick = () => { 
        editingDocIndex = -1; modal.style.display = "flex"; document.getElementById('vault-modal-title').innerText = "Add to Vault";
        document.getElementById('dynamic-fields').innerHTML = ''; document.getElementById('doc-type-text').innerText = "Select Category";
        currentDocType = null; tempDocImage = null; document.getElementById('file-label').innerHTML = "<span>Tap to Attach Photo 📷</span>"; 
    };
    document.getElementById('cancel-doc-btn').onclick = () => modal.style.display = "none";
    document.getElementById('file-label').onclick = () => document.getElementById('doc-file-input').click();
    document.getElementById('doc-file-input').onchange = (e) => { const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onload = async (evt) => { tempDocImage = await resizeImage(evt.target.result); document.getElementById('file-label').innerHTML = "<span style='color:var(--success)'>Photo Attached ✓</span>"; }; r.readAsDataURL(f); }};

    document.getElementById('save-doc-btn').onclick = () => {
        if(!currentDocType) return showToast("Select a Category");
        const val = (id) => document.getElementById(id) ? document.getElementById(id).value : '';
        let doc = { type: currentDocType, date: new Date().toLocaleDateString(), image: tempDocImage };
        if(currentDocType === 'Gift Card') { doc.subtype = val('gc-type'); doc.uid = val('gc-uid'); } 
        else if(currentDocType === 'ATM / Debit Card') { doc.class = val('atm-class'); doc.vendor = val('atm-vendor'); doc.bank = val('atm-bank'); doc.holder = val('atm-holder'); doc.num = val('atm-num'); doc.exp = val('atm-exp'); doc.cvv = val('atm-cvv'); } 
        else if(currentDocType === 'Pass Book') { doc.bank = val('pb-bank'); doc.acc = val('pb-acc'); doc.ifsc = val('pb-ifsc'); doc.holder = val('pb-holder'); doc.cif = val('pb-cif'); doc.acctype = val('pb-type'); } 
        else if(currentDocType === 'Aadhar Card') { doc.name = val('ad-name'); doc.num = val('ad-num'); doc.father = val('ad-father'); doc.addr = val('ad-addr'); } 
        else if(currentDocType === 'Certificate') { doc.name = val('cert-name'); doc.auth = val('cert-auth'); } 
        else { doc.name = val('gen-title'); doc.tags = []; document.querySelectorAll('.tag-row').forEach(row => { doc.tags.push({ key: row.querySelector('.tag-key').value, val: row.querySelector('.tag-val').value }); }); }
        
        const list = JSON.parse(localStorage.getItem('user-docs') || '[]');
        if(editingDocIndex >= 0) { if(!doc.image) doc.image = list[editingDocIndex].image; list[editingDocIndex] = doc; showToast("Vault Updated"); } 
        else { list.push(doc); showToast("Saved to Vault"); }
        localStorage.setItem('user-docs', JSON.stringify(list)); modal.style.display = 'none'; renderDocs(); 
    };

    const renderDocs = () => {
        const list = JSON.parse(localStorage.getItem('user-docs') || '[]'); 
        const c = document.getElementById('data-list'); c.innerHTML = '';
        
        // FILTER LOGIC
        const filteredList = (currentVaultFilter === 'All Items') ? list : list.filter(d => d.type === currentVaultFilter);

        if(filteredList.length === 0) { c.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:50px;">Nothing found in ${currentVaultFilter}.</p>`; return; }
        
        filteredList.forEach((d, i) => {
            // Because we are filtering, the index 'i' is local to filtered list. 
            // We need original index for editing/deleting.
            const originalIndex = list.findIndex(x => x === d);
            
            const el = document.createElement('div'); el.className = 'vault-item-minimal';
            let icon = '📄';
            if(d.type.includes('ATM')) icon = '💳';
            if(d.type.includes('Pass')) icon = '📒';
            if(d.type.includes('Gift')) icon = '🎁';
            if(d.type.includes('Aadhar')) icon = '🆔';
            let title = d.type;
            if(d.bank) title = d.bank;
            if(d.name && d.type !== 'Aadhar Card') title = d.name; 
            
            el.innerHTML = `<div style="display:flex; align-items:center;"><div class="vault-icon">${icon}</div><div><div style="font-weight:600;">${title}</div><div style="font-size:11px; opacity:0.6;">${d.type}</div></div></div><div style="font-size:11px; opacity:0.5;">${d.date}</div>`;
            el.onclick = () => openDocDetail(originalIndex);
            c.appendChild(el);
        });
    };

    const openDocDetail = (index) => {
        const list = JSON.parse(localStorage.getItem('user-docs'));
        const d = list[index];
        const modal = document.getElementById('vault-detail-modal');
        const visualC = document.getElementById('detail-visual-container');
        const infoC = document.getElementById('detail-info-container');
        
        let inner = '', cls = 'visual-card';
        if(d.type === 'ATM / Debit Card') { cls += ' atm'; inner = `<div style="font-size:18px; font-weight:700; margin-bottom:15px; letter-spacing:1px; display:flex; justify-content:space-between;"><span>${d.bank || 'Bank'}</span><span style="font-size:12px; opacity:0.8;">${d.vendor}</span></div><div class="chip"></div><div style="font-family:monospace; font-size:20px; letter-spacing:2px; margin-bottom:15px;">${d.num || '•••• ••••'}</div><div style="display:flex; justify-content:space-between;"><div><div style="font-size:9px; opacity:0.7;">HOLDER</div><div style="font-size:14px; text-transform:uppercase;">${d.holder || 'NAME'}</div></div><div style="text-align:right;"><div style="font-size:9px; opacity:0.7;">VALID</div><div style="font-size:12px;">${d.exp || '00/00'}</div></div></div>`; } 
        else if(d.type === 'Gift Card') { cls += ' gift'; inner = `<div style="display:flex; align-items:center; gap:10px;"><span style="font-size:30px;">🎁</span><div style="font-weight:700; font-size:20px;">${d.subtype || 'Gift'}</div></div><div style="margin-top:15px; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; font-family:monospace; text-align:center;">${d.uid || 'CODE'}</div>`; } 
        else if(d.type === 'Pass Book') { cls += ' passbook'; inner = `<h3 style="margin:0 0 10px 0;">${d.bank || 'Passbook'}</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:12px;"><div><strong>Acc:</strong> ${d.acc}</div><div><strong>IFSC:</strong> ${d.ifsc}</div><div><strong>Name:</strong> ${d.holder}</div></div>`; } 
        else if(d.type === 'Aadhar Card') { cls += ' aadhar'; inner = `<div style="text-align:center; font-weight:bold; color:#f39c12; margin-bottom:10px;">GOVT OF INDIA</div><div style="display:flex; gap:10px;">${d.image ? `<img src="${d.image}" style="width:50px; height:50px;">` : ''}<div><div><strong>${d.name}</strong></div><div style="font-size:14px; font-weight:bold;">${d.num}</div></div></div>`; } 
        else { inner = `<div style="font-weight:700; font-size:18px; color:var(--primary); margin-bottom:10px;">${d.type}</div>${d.name ? `<div style="font-size:16px;">${d.name}</div>` : ''}`; }

        visualC.innerHTML = `<div class="${cls}">${inner}</div>`;
        if(d.image) visualC.innerHTML += `<button onclick="viewImg('${d.image}')" class="action-btn btn-outline" style="margin-top:0;">View Attached Image</button>`;

        let infoHtml = '';
        Object.entries(d).forEach(([k, v]) => { if(k !== 'image' && k !== 'tags' && v) infoHtml += `<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--glass-border); font-size:14px;"><span style="opacity:0.6; text-transform:capitalize;">${k}</span><span style="font-weight:600; text-align:right; max-width:60%;">${v}</span></div>`; });
        if(d.tags) d.tags.forEach(t => { infoHtml += `<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--glass-border); font-size:14px;"><span style="opacity:0.6;">${t.key}</span><span style="font-weight:600;">${t.val}</span></div>`; });
        infoC.innerHTML = infoHtml;

        document.getElementById('btn-detail-edit').onclick = () => { modal.style.display = 'none'; openEditMode(index, d); };
        document.getElementById('btn-detail-del').onclick = () => {
            const hasPin = localStorage.getItem('user-pin');
            // DELETE FLOW: PIN -> CONFIRM -> DELETE
            if(hasPin) {
                openPin('verify-action', () => {
                    // PIN Correct, now show strict confirm
                    showConfirm("Permanent Delete", "Are you sure you want to delete this? This action cannot be undone.", () => performDelete(index));
                }, "Confirm PIN to Delete");
            } else {
                showConfirm("Permanent Delete", "Are you sure you want to delete this? This action cannot be undone.", () => performDelete(index));
            }
        };
        modal.style.display = 'flex';
    };
    document.getElementById('close-detail').onclick = () => document.getElementById('vault-detail-modal').style.display = 'none';

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

    // --- EXPENSES WITH FILTER ---
    
    // Setup Exp Filter
    document.getElementById('exp-filter-trigger').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('exp-filter-wrap').classList.toggle('open');
    };
    document.querySelectorAll('#exp-filter-options .custom-option').forEach(el => {
        el.onclick = () => {
            currentExpFilter = el.getAttribute('data-val');
            document.getElementById('exp-filter-text').innerText = el.innerText;
            document.getElementById('exp-filter-wrap').classList.remove('open');
            renderExpenditure();
        };
    });

    const renderExpenditure = () => {
        const list = JSON.parse(localStorage.getItem('user-expenses') || '[]');
        const listContainer = document.getElementById('exp-history-list');
        listContainer.innerHTML = '';
        
        let totalBal = 0; // Total ever
        let filteredUsed = 0; // Total Expense for selected period

        const now = new Date();
        now.setHours(0,0,0,0);
        
        // Calculate Global Balance first
        list.forEach(i => {
             if(i.type === 'credit') totalBal += parseFloat(i.amount);
             else totalBal -= parseFloat(i.amount);
        });

        // Filter List
        const filteredList = list.filter(item => {
            const d = new Date(item.isoDate);
            d.setHours(0,0,0,0);
            if(currentExpFilter === 'today') return d.getTime() === now.getTime();
            if(currentExpFilter === 'week') {
                const day = now.getDay();
                const diff = now.getDate() - day + (day == 0 ? -6:1);
                const startOfWeek = new Date(now.setDate(diff));
                return d >= startOfWeek;
            }
            if(currentExpFilter === 'month') return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
            return true;
        });

        // Calculate Stats for Filtered Period
        filteredList.forEach(item => {
            if(item.type === 'debit') filteredUsed += parseFloat(item.amount);
        });

        // Update Labels
        let label = "Total Used Today";
        if(currentExpFilter === 'week') label = "Total Used This Week";
        if(currentExpFilter === 'month') label = "Total Used This Month";

        document.getElementById('exp-total-balance').innerText = `₹${totalBal.toLocaleString()}`;
        document.getElementById('stat-lbl-dynamic').innerText = label;
        document.getElementById('stat-exp-dynamic').innerText = `₹${filteredUsed.toLocaleString()}`;

        if(filteredList.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; opacity:0.5;">No transactions for this period.</p>`;
        } else {
            [...filteredList].reverse().forEach(item => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.padding = '12px 0';
                row.style.borderBottom = '1px solid var(--glass-border)';
                const isCredit = item.type === 'credit';
                row.innerHTML = `<div><div style="font-weight:600;">${item.desc || (isCredit ? 'Income' : 'Expense')}</div><div style="font-size:11px; opacity:0.6;">${item.date}</div></div><div style="font-weight:700; color:${isCredit ? 'var(--success)' : 'var(--danger)'}; font-size:16px;">${isCredit ? '+' : '-'}₹${item.amount}</div>`;
                listContainer.appendChild(row);
            });
        }
    };
    
    const expModal = document.getElementById('expense-modal');
    document.getElementById('btn-add-income').onclick = () => { currentExpType = 'credit'; document.getElementById('exp-modal-title').innerText = "Add Income"; document.getElementById('save-exp-btn').style.background = "var(--success)"; expModal.style.display = 'flex'; };
    document.getElementById('btn-add-expense').onclick = () => { currentExpType = 'debit'; document.getElementById('exp-modal-title').innerText = "Add Expense"; document.getElementById('save-exp-btn').style.background = "var(--danger)"; expModal.style.display = 'flex'; };
    document.getElementById('close-exp-btn').onclick = () => expModal.style.display = 'none';
    document.getElementById('save-exp-btn').onclick = () => {
        const amt = document.getElementById('exp-amount-input').value;
        const desc = document.getElementById('exp-desc-input').value;
        if(!amt || amt <= 0) return showToast("Enter valid amount");
        const list = JSON.parse(localStorage.getItem('user-expenses') || '[]');
        list.push({ type: currentExpType, amount: amt, desc: desc, date: new Date().toLocaleDateString(), isoDate: new Date().toISOString() });
        localStorage.setItem('user-expenses', JSON.stringify(list));
        expModal.style.display = 'none';
        renderExpenditure();
        showToast("Saved");
        document.getElementById('exp-amount-input').value = '';
    };

    // --- SETTINGS, SAVINGS, HELPERS (Standard) ---
    const renderSettings = () => { const hasPin = localStorage.getItem('user-pin'); document.getElementById('toggle-pin').checked = !!hasPin; document.getElementById('pin-opts').style.display = hasPin ? 'block' : 'none'; };
    document.getElementById('toggle-pin').onclick = (e) => { e.preventDefault(); const hasPin = localStorage.getItem('user-pin'); if(hasPin) openPin('remove', () => { localStorage.removeItem('user-pin'); renderSettings(); showToast("PIN Removed"); }, "Enter PIN to Disable"); else openPin('set', null); };
    document.getElementById('btn-change-pin').onclick = () => { openPin('verify-action', () => { openPin('set', null); }, "Enter Old PIN"); };

    const renderSavings = () => {
        const list = JSON.parse(localStorage.getItem('user-savings') || '[]');
        const tbody = document.getElementById('savings-list'); tbody.innerHTML = '';
        let total = 0;
        list.forEach((item, index) => { total += parseFloat(item.amount); tbody.innerHTML += `<tr><td>${index + 1}</td><td>${item.date}</td><td style="text-align:right; color:var(--success);">+ ₹${item.amount}</td></tr>`; });
        document.getElementById('total-balance').innerText = `₹${total.toLocaleString()}`;
        document.getElementById('summary-times').innerText = `Times Added: ${list.length}`;
        document.getElementById('summary-date').innerText = `Date: ${new Date().toLocaleDateString()}`;
    };
    const sModal = document.getElementById('savings-modal');
    document.getElementById('add-savings-btn').onclick = () => { document.getElementById('savings-input').value = ''; sModal.style.display = 'flex'; };
    document.getElementById('close-savings-btn').onclick = () => sModal.style.display = 'none';
    document.getElementById('process-savings-btn').onclick = () => {
        const amt = document.getElementById('savings-input').value; if(!amt) return; tempSavingsAmount = amt; sModal.style.display = 'none';
        showConfirm("Confirm Deposit", `Add ₹${amt} to savings?`, () => {
            const list = JSON.parse(localStorage.getItem('user-savings') || '[]'); list.push({ amount: tempSavingsAmount, date: new Date().toLocaleDateString() });
            localStorage.setItem('user-savings', JSON.stringify(list)); confirmModal.style.display = 'none'; renderSavings(); showToast("Added to Savings");
        });
    };

    window.viewImg = (src) => { document.getElementById('viewer-img').src = src; document.getElementById('img-viewer').style.display = 'flex'; };
    document.getElementById('close-img').onclick = () => document.getElementById('img-viewer').style.display = 'none';
    window.setTheme = (t) => { localStorage.setItem('theme', t); if(t === 'system') { const dark = window.matchMedia('(prefers-color-scheme: dark)').matches; document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); } else { document.documentElement.setAttribute('data-theme', t); } document.querySelectorAll('.theme-opt').forEach(e => e.classList.remove('active')); document.getElementById(`theme-${t}`).classList.add('active'); };

    const init = () => { renderProfile(); setTheme(localStorage.getItem('theme') || 'dark'); };
    init();
});
