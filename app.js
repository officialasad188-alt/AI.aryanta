document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const screens = {
        main: document.getElementById('main-app'),
        settings: document.getElementById('settings-screen'),
        profile: document.getElementById('profile-screen'),
        data: document.getElementById('data-screen'),
        savings: document.getElementById('savings-screen'),
        expenditure: document.getElementById('expenditure-screen')
    };

    let isEditing = false;
    let tempDocImage = null;
    let currentDocType = null;
    let tempSavingsAmount = 0;
    let currentExpType = 'credit'; // 'credit' or 'debit'

    // --- PROFILE KEYS ---
    const profileKeys = [
        { key: 'name', label: 'Full Name' },
        { key: 'father', label: 'Father Name' },
        { key: 'mother', label: 'Mother Name' },
        { key: 'phone', label: 'Mobile Number' },
        { key: 'dob', label: 'Date of Birth' },
        { key: 'address', label: 'Address' }
    ];

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

    document.getElementById('btn-profile').onclick = () => { renderProfile(); nav('profile'); };
    document.getElementById('btn-settings').onclick = () => nav('settings');
    document.getElementById('btn-data').onclick = () => { renderDocs(); nav('data'); };
    document.getElementById('btn-savings').onclick = () => { renderSavings(); nav('savings'); };
    document.getElementById('btn-expenditure').onclick = () => { renderExpenditure(); nav('expenditure'); };
    
    document.getElementById('back-from-profile').onclick = () => nav('main');
    document.getElementById('back-from-settings').onclick = () => nav('main');
    document.getElementById('back-from-data').onclick = () => nav('main');
    document.getElementById('back-from-savings').onclick = () => nav('main');
    document.getElementById('back-from-exp').onclick = () => nav('main');

    // --- SETTINGS LOGIC ---
    ['toggle-notice', 'toggle-ui', 'toggle-anim'].forEach(id => {
        const el = document.getElementById(id);
        const saved = localStorage.getItem(id);
        if(saved !== null) el.checked = (saved === 'true');
        el.onclick = () => {
            localStorage.setItem(id, el.checked);
            showToast("Preference Saved");
        };
    });

    // --- EXPENDITURE LOGIC (NEW) ---
    const renderExpenditure = () => {
        const list = JSON.parse(localStorage.getItem('user-expenses') || '[]');
        const listContainer = document.getElementById('exp-history-list');
        listContainer.innerHTML = '';

        let totalBal = 0;
        let incMonth = 0;
        let expMonth = 0;
        let expToday = 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const todayStr = now.toLocaleDateString();

        // Calculate Stats
        list.forEach(item => {
            const amount = parseFloat(item.amount);
            const itemDate = new Date(item.isoDate);
            
            if(item.type === 'credit') {
                totalBal += amount;
                if(itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
                    incMonth += amount;
                }
            } else {
                totalBal -= amount;
                if(itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
                    expMonth += amount;
                }
                if(item.date === todayStr) {
                    expToday += amount;
                }
            }
        });

        // Update UI Stats
        document.getElementById('exp-total-balance').innerText = `₹${totalBal.toLocaleString()}`;
        document.getElementById('stat-inc-month').innerText = `+₹${incMonth.toLocaleString()}`;
        document.getElementById('stat-exp-month').innerText = `-₹${expMonth.toLocaleString()}`;
        document.getElementById('stat-exp-today').innerText = `₹${expToday.toLocaleString()}`;

        // Render History List
        if(list.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; opacity:0.5;">No transactions found.</p>`;
        } else {
            // Show recent first
            [...list].reverse().slice(0, 10).forEach(item => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.padding = '12px 0';
                row.style.borderBottom = '1px solid var(--glass-border)';
                
                const isCredit = item.type === 'credit';
                const color = isCredit ? 'var(--success)' : 'var(--danger)';
                const sign = isCredit ? '+' : '-';

                row.innerHTML = `
                    <div>
                        <div style="font-weight:600;">${item.desc || (isCredit ? 'Income' : 'Expense')}</div>
                        <div style="font-size:11px; opacity:0.6;">${item.date}</div>
                    </div>
                    <div style="font-weight:700; color:${color}; font-size:16px;">
                        ${sign}₹${item.amount}
                    </div>
                `;
                listContainer.appendChild(row);
            });
        }
    };

    // Expenditure Modals
    const expModal = document.getElementById('expense-modal');
    
    document.getElementById('btn-add-income').onclick = () => {
        currentExpType = 'credit';
        document.getElementById('exp-modal-title').innerText = "Add Income";
        document.getElementById('exp-modal-desc').innerText = "Add money to your balance.";
        document.getElementById('save-exp-btn').style.background = "var(--success)";
        document.getElementById('exp-amount-input').value = '';
        document.getElementById('exp-desc-input').value = '';
        expModal.style.display = 'flex';
    };

    document.getElementById('btn-add-expense').onclick = () => {
        currentExpType = 'debit';
        document.getElementById('exp-modal-title').innerText = "Add Expense";
        document.getElementById('exp-modal-desc').innerText = "Deduct money from balance.";
        document.getElementById('save-exp-btn').style.background = "var(--danger)";
        document.getElementById('exp-amount-input').value = '';
        document.getElementById('exp-desc-input').value = '';
        expModal.style.display = 'flex';
    };

    document.getElementById('close-exp-btn').onclick = () => expModal.style.display = 'none';

    document.getElementById('save-exp-btn').onclick = () => {
        const amt = document.getElementById('exp-amount-input').value;
        const desc = document.getElementById('exp-desc-input').value;
        
        if(!amt || amt <= 0) return showToast("Enter valid amount");

        const list = JSON.parse(localStorage.getItem('user-expenses') || '[]');
        list.push({
            type: currentExpType,
            amount: amt,
            desc: desc,
            date: new Date().toLocaleDateString(),
            isoDate: new Date().toISOString()
        });
        
        localStorage.setItem('user-expenses', JSON.stringify(list));
        expModal.style.display = 'none';
        renderExpenditure();
        showToast(currentExpType === 'credit' ? "Income Added" : "Expense Added");
    };


    // --- SAVINGS LOGIC ---
    const renderSavings = () => {
        const list = JSON.parse(localStorage.getItem('user-savings') || '[]');
        const tbody = document.getElementById('savings-list');
        tbody.innerHTML = '';
        
        let total = 0;
        if(list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; opacity:0.5; padding:20px;">No transactions yet.</td></tr>`;
        } else {
            list.forEach((item, index) => {
                total += parseFloat(item.amount);
                const row = document.createElement('tr');
                row.innerHTML = `<td>${index + 1}</td><td>${item.date}</td><td style="text-align:right; color:var(--success);">+ ₹${item.amount}</td>`;
                tbody.appendChild(row);
            });
        }
        document.getElementById('total-balance').innerText = `₹${total.toLocaleString()}`;
        document.getElementById('summary-times').innerText = `Times Added: ${list.length}`;
        document.getElementById('summary-date').innerText = `Date: ${new Date().toLocaleDateString()}`;
    };

    const sModal = document.getElementById('savings-modal');
    const cModal = document.getElementById('confirm-modal');
    document.getElementById('add-savings-btn').onclick = () => { document.getElementById('savings-input').value = ''; sModal.style.display = 'flex'; };
    document.getElementById('close-savings-btn').onclick = () => sModal.style.display = 'none';
    document.getElementById('process-savings-btn').onclick = () => {
        const amt = document.getElementById('savings-input').value;
        if(!amt || amt <= 0) return showToast("Enter valid amount");
        tempSavingsAmount = amt;
        sModal.style.display = 'none';
        document.getElementById('confirm-msg').innerText = `Confirm Deposit: You are securely adding ₹${amt} to your savings account.`;
        cModal.style.display = 'flex';
    };
    document.getElementById('confirm-no').onclick = () => cModal.style.display = 'none';
    document.getElementById('confirm-yes').onclick = () => {
        const list = JSON.parse(localStorage.getItem('user-savings') || '[]');
        list.push({ amount: tempSavingsAmount, date: new Date().toLocaleDateString() });
        localStorage.setItem('user-savings', JSON.stringify(list));
        cModal.style.display = 'none';
        renderSavings();
        showToast("Amount Added Successfully");
    };

    // --- PROFILE LOGIC ---
    const renderProfile = () => {
        const container = document.getElementById('profile-fields');
        container.innerHTML = '';
        profileKeys.forEach(p => {
            const val = localStorage.getItem(`user-${p.key}`) || '';
            const div = document.createElement('div');
            div.style.marginBottom = '15px';
            if(isEditing) {
                div.innerHTML = `<div class="section-label">${p.label}</div><input type="text" id="input-${p.key}" value="${val}" class="modern-input">`;
            } else {
                div.innerHTML = `<div class="section-label">${p.label}</div><div style="font-size:16px; font-weight:500; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">${val || '-'}</div>`;
            }
            container.appendChild(div);
        });
        const n = localStorage.getItem('user-name');
        if(n) document.getElementById('dash-name').innerText = n;
        const pic = localStorage.getItem('profile-pic');
        if(pic) { document.getElementById('dash-pic').src = pic; document.getElementById('profile-pic-detail').src = pic; }
    };

    document.getElementById('edit-profile-btn').onclick = function() {
        if(!isEditing) {
            isEditing = true; this.innerText = "SAVE"; this.style.color = "var(--success)"; document.getElementById('camera-overlay').style.display = "flex";
        } else {
            profileKeys.forEach(p => { const el = document.getElementById(`input-${p.key}`); if(el) localStorage.setItem(`user-${p.key}`, el.value); });
            isEditing = false; this.innerText = "EDIT"; this.style.color = "var(--primary)"; document.getElementById('camera-overlay').style.display = "none"; showToast("Profile Updated");
        }
        renderProfile();
    };

    document.getElementById('camera-overlay').onclick = () => document.getElementById('pic-upload').click();
    document.getElementById('pic-upload').onchange = (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = async (evt) => {
                const resized = await resizeImage(evt.target.result);
                localStorage.setItem('profile-pic', resized);
                renderProfile();
                showToast("Photo Updated");
            };
            reader.readAsDataURL(file);
        }
    };

    // --- DATA VAULT LOGIC ---
    const renderDocFields = (type) => {
        currentDocType = type;
        const c = document.getElementById('dynamic-fields');
        c.innerHTML = '';
        const mkIn = (id, ph) => `<input id="${id}" placeholder="${ph}" class="modern-input">`;
        const mkSel = (id, opts) => `<select id="${id}" class="modern-input">${opts.map(o=>`<option>${o}</option>`).join('')}</select>`;
        let html = '';
        if(type === 'Gift Card') { html += mkSel('gc-type', ['Play Store', 'Steam', 'Amazon', 'Apple', 'Xbox', 'Other']); html += mkIn('gc-uid', 'Redeem Code / UID'); } 
        else if(type === 'ATM / Debit Card') { html += mkSel('atm-class', ['Debit Card', 'Credit Card']); html += mkSel('atm-vendor', ['Visa', 'Mastercard', 'Rupay', 'Amex']); html += mkIn('atm-bank', 'Bank Name'); html += mkIn('atm-holder', 'Card Holder Name'); html += mkIn('atm-num', 'Card Number'); html += `<div style="display:flex; gap:10px;">${mkIn('atm-exp', 'Expiry MM/YY')} ${mkIn('atm-cvv', 'CVV')}</div>`; } 
        else if(type === 'Pass Book') { html += mkIn('pb-bank', 'Bank Name'); html += mkIn('pb-acc', 'Account Number'); html += mkIn('pb-ifsc', 'IFSC Code'); html += mkIn('pb-holder', 'Account Holder Name'); html += mkIn('pb-cif', 'CIF Number'); html += mkSel('pb-type', ['Savings', 'Current', 'Salary', 'Student']); } 
        else if(type === 'Aadhar Card') { html += mkIn('ad-name', 'Name on Card'); html += mkIn('ad-num', 'Aadhar Number'); html += mkIn('ad-father', 'Father Name'); html += mkIn('ad-addr', 'Full Address'); } 
        else if(type === 'Certificate') { html += mkIn('cert-name', 'Certificate Name'); html += mkIn('cert-auth', 'Issuing Authority'); } 
        else { html += `<div id="tags-container"></div>`; html += `<button id="add-tag-btn" style="width:100%; padding:12px; border:1px dashed var(--primary); color:var(--primary); background:rgba(0,0,0,0.1); border-radius:12px; cursor:pointer;">+ Add Custom Field</button>`; }
        c.innerHTML = html;
        if(document.getElementById('add-tag-btn')) {
            document.getElementById('add-tag-btn').onclick = () => {
                const div = document.createElement('div'); div.className = 'tag-row';
                div.innerHTML = `<input class="modern-input tag-key" placeholder="Label" style="flex:1; margin:0;"><input class="modern-input tag-val" placeholder="Value" style="flex:1; margin:0;"><button class="remove-tag">&times;</button>`;
                document.getElementById('tags-container').appendChild(div);
                div.querySelector('.remove-tag').onclick = () => div.remove();
            };
        }
    };
    document.getElementById('doc-type-select').onchange = (e) => renderDocFields(e.target.value);

    // DOC MODAL
    const modal = document.getElementById('add-modal');
    document.getElementById('add-data-btn').onclick = () => { modal.style.display = "flex"; document.getElementById('dynamic-fields').innerHTML = ''; document.getElementById('doc-type-select').value = ""; tempDocImage = null; document.getElementById('file-label').innerHTML = "<span>Tap to Attach Photo 📷</span>"; };
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
        else { doc.tags = []; document.querySelectorAll('.tag-row').forEach(row => { doc.tags.push({ key: row.querySelector('.tag-key').value, val: row.querySelector('.tag-val').value }); }); }
        const list = JSON.parse(localStorage.getItem('user-docs') || '[]'); list.push(doc); localStorage.setItem('user-docs', JSON.stringify(list)); modal.style.display = 'none'; renderDocs(); showToast("Saved to Vault");
    };

    const renderDocs = () => {
        const list = JSON.parse(localStorage.getItem('user-docs') || '[]'); const c = document.getElementById('data-list'); c.innerHTML = '';
        if(list.length === 0) { c.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:50px;">Vault is empty.</p>`; return; }
        list.forEach((d, i) => {
            let inner = '', cls = 'premium-card';
            if(d.type === 'ATM / Debit Card') { cls = 'visual-card atm'; inner = `<div style="font-size:18px; font-weight:700; margin-bottom:15px; letter-spacing:1px; display:flex; justify-content:space-between;"><span>${d.bank || 'Bank'}</span><span style="font-size:12px; opacity:0.8;">${d.vendor}</span></div><div class="chip"></div><div style="font-family:monospace; font-size:20px; letter-spacing:2px; margin-bottom:15px;">${d.num || '•••• ••••'}</div><div style="display:flex; justify-content:space-between;"><div><div style="font-size:9px; opacity:0.7;">HOLDER</div><div style="font-size:14px; text-transform:uppercase;">${d.holder || 'NAME'}</div></div><div style="text-align:right;"><div style="font-size:9px; opacity:0.7;">VALID</div><div style="font-size:12px;">${d.exp || '00/00'}</div></div></div>`; } 
            else if(d.type === 'Gift Card') { cls = 'visual-card gift'; inner = `<div style="display:flex; align-items:center; gap:10px;"><span style="font-size:30px;">🎁</span><div style="font-weight:700; font-size:20px;">${d.subtype || 'Gift'}</div></div><div style="margin-top:15px; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; font-family:monospace; text-align:center;">${d.uid || 'CODE'}</div>`; } 
            else if(d.type === 'Pass Book') { cls = 'visual-card passbook'; inner = `<h3 style="margin:0 0 10px 0;">${d.bank || 'Passbook'}</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:12px;"><div><strong>Acc:</strong> ${d.acc}</div><div><strong>IFSC:</strong> ${d.ifsc}</div><div><strong>Name:</strong> ${d.holder}</div></div>`; } 
            else if(d.type === 'Aadhar Card') { cls = 'visual-card aadhar'; inner = `<div style="text-align:center; font-weight:bold; color:#f39c12; margin-bottom:10px;">GOVT OF INDIA</div><div style="display:flex; gap:10px;">${d.image ? `<img src="${d.image}" style="width:50px; height:50px;">` : ''}<div><div><strong>${d.name}</strong></div><div style="font-size:14px; font-weight:bold;">${d.num}</div></div></div>`; } 
            else { let tagsHtml = d.tags ? d.tags.map(t => `<div>${t.key}: ${t.val}</div>`).join('') : ''; inner = `<div style="font-weight:700; color:var(--primary); margin-bottom:5px;">${d.type}</div>${d.name ? `<div>${d.name}</div>` : ''}${tagsHtml}`; }
            const el = document.createElement('div'); el.className = cls;
            el.innerHTML = `<button class="card-del" onclick="delDoc(${i})">&times;</button>${inner}${d.image ? `<button style="margin-top:10px; padding:6px 12px; background:rgba(255,255,255,0.25); border:none; border-radius:20px; color:inherit; font-size:11px; cursor:pointer;" onclick="viewImg('${d.image}')">View Photo</button>` : ''}`;
            c.appendChild(el);
        });
    };

    window.delDoc = (i) => { if(confirm("Delete item?")) { const list = JSON.parse(localStorage.getItem('user-docs')); list.splice(i, 1); localStorage.setItem('user-docs', JSON.stringify(list)); renderDocs(); }};
    window.viewImg = (src) => { document.getElementById('viewer-img').src = src; document.getElementById('img-viewer').style.display = 'flex'; };
    document.getElementById('close-img').onclick = () => document.getElementById('img-viewer').style.display = 'none';

    window.setTheme = (t) => { localStorage.setItem('theme', t); if(t === 'system') { const dark = window.matchMedia('(prefers-color-scheme: dark)').matches; document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); } else { document.documentElement.setAttribute('data-theme', t); } document.querySelectorAll('.theme-opt').forEach(e => e.classList.remove('active')); document.getElementById(`theme-${t}`).classList.add('active'); };
    const init = () => { renderProfile(); setTheme(localStorage.getItem('theme') || 'dark'); };
    init();
});
