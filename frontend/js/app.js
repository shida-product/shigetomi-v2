import { CONFIG } from './config.js';

class CheckinForm {
  constructor() {
    this.currentLang = this.getLangFromUrl() || 'ja';
    this.answers = {};
    this.currentStep = -1;  // -1 = イントロページ
    this.steps = [];      // 表示するセクション番号の配列
    this.direction = 1;   // 1=次へ, -1=戻る (アニメーション方向)
    
    // DOM
    this.fieldsArea = document.getElementById('fields-area');
    this.stepTitle = document.getElementById('step-title');
    this.stepDesc = document.getElementById('step-desc');
    this.stepperContainer = document.getElementById('stepper-container');
    this.nextBtn = document.getElementById('next-btn');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextText = document.getElementById('next-text');
    this.prevText = document.getElementById('prev-text');
    this.nextArrow = document.getElementById('next-arrow');
    this.backLink = document.getElementById('back-link');

    this.init();
  }

  getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang && CONFIG.languages.some(l => l.code === lang)) return lang;
    return null;
  }

  init() {
    this.buildSteps();
    this.renderStep();
    this.setupEventListeners();
  }

  // ========== ステップ構築 ==========
  buildSteps() {
    // 全セクション番号を抽出（条件付きセクションも含む）
    const sectionNums = new Set();
    CONFIG.fields.forEach(f => {
      if (f.id === 'furigana' && this.currentLang !== 'ja') return;
      sectionNums.add(f.section);
    });
    this.steps = [...sectionNums].sort((a, b) => a - b);
  }

  // 現在のステップのセクション番号
  get currentSectionNum() {
    return this.steps[this.currentStep];
  }

  // 条件付きセクションかどうか（パスポート情報 = section 3）
  shouldSkipStep(sectionNum) {
    // section 3 は「国内住所あり」なら飛ばす
    if (sectionNum === 3 && this.answers.has_domestic_address !== 'no') {
      return true;
    }
    return false;
  }

  // 有効なステップ数（スキップ分を除く）
  get totalVisibleSteps() {
    return this.steps.filter(s => !this.shouldSkipStep(s)).length;
  }

  get currentVisibleIndex() {
    let idx = 0;
    for (let i = 0; i < this.currentStep; i++) {
      if (!this.shouldSkipStep(this.steps[i])) idx++;
    }
    return idx;
  }

  // ========== ステップ描画 ==========
  renderStep() {
    const texts = CONFIG.i18n[this.currentLang];

    // ========== イントロページ ==========
    if (this.currentStep === -1) {
      this.renderIntroPage(texts);
      return;
    }

    const sectionNum = this.currentSectionNum;

    // ヘッダー更新（セクション名は非表示、説明文のみ表示）
    this.stepTitle.textContent = '';
    this.stepTitle.style.display = 'none';
    // セクション別説明文を表示（descriptionsがあれば優先）
    const sectionDesc = (texts.descriptions && texts.descriptions[sectionNum] !== undefined) ? texts.descriptions[sectionNum] : (texts.description || '');

    // セクション5: 【重要】の前にマニュアルボタンを挿入
    if (sectionNum === 5 && CONFIG.manual_url) {
      // 重要マーカーで分割
      const importantMarkers = ['【重要】', '[IMPORTANT]', '[IMPORTANTE]', '【중요】'];
      let beforeImportant = sectionDesc;
      let afterImportant = '';
      for (const marker of importantMarkers) {
        const idx = sectionDesc.indexOf(marker);
        if (idx !== -1) {
          beforeImportant = sectionDesc.substring(0, idx);
          afterImportant = sectionDesc.substring(idx);
          break;
        }
      }

      // 前半テキスト
      const beforeDiv = document.createElement('div');
      beforeDiv.innerHTML = beforeImportant.replace(/\n/g, '<br>');
      this.stepDesc.innerHTML = '';
      this.stepDesc.appendChild(beforeDiv);

      // マニュアルボタン（中央揃え）
      const manualBtnWrapper = document.createElement('div');
      manualBtnWrapper.className = 'flex justify-center my-5';

      const manualBtn = document.createElement('a');
      manualBtn.href = CONFIG.manual_url;
      manualBtn.target = '_blank';
      manualBtn.rel = 'noopener noreferrer';
      manualBtn.className = 'inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-shu/80 text-shu font-medium text-sm transition-all hover:bg-shu/5 active:scale-95';
      manualBtn.innerHTML = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><span>${texts.buttons.manual_button || 'View House Manual'}</span><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`;

      if (this._manualOpened) {
        manualBtn.classList.remove('border-shu/80', 'text-shu');
        manualBtn.classList.add('border-green-500', 'text-green-700', 'bg-green-50');
        const label = manualBtn.querySelector('span');
        if (label) label.textContent = `✓ ${texts.buttons.manual_opened || 'Viewed'}`;
      }

      manualBtn.addEventListener('click', () => {
        this._manualOpened = true;
        manualBtn.classList.remove('border-shu/80', 'text-shu');
        manualBtn.classList.add('border-green-500', 'text-green-700', 'bg-green-50');
        const label = manualBtn.querySelector('span');
        if (label) label.textContent = `✓ ${texts.buttons.manual_opened || 'Viewed'}`;
        this.enableAgreeField();
      });

      manualBtnWrapper.appendChild(manualBtn);
      this.stepDesc.appendChild(manualBtnWrapper);

      // 後半テキスト（【重要】以降）
      if (afterImportant) {
        const afterDiv = document.createElement('div');
        afterDiv.innerHTML = afterImportant.replace(/\n/g, '<br>');
        this.stepDesc.appendChild(afterDiv);
      }
    } else {
      this.stepDesc.innerHTML = sectionDesc.replace(/\n/g, '<br>');
    }

    // 戻りリンク更新（ステップ1→言語選択、それ以外→前セクション）
    const backLink = document.getElementById('back-link');
    const backLinkText = document.getElementById('back-link-text');
    if (backLink && backLinkText) {
      // 既存のクリックハンドラを解除するためcloneで置換
      const newBackLink = backLink.cloneNode(true);
      backLink.parentNode.replaceChild(newBackLink, backLink);
      const newText = newBackLink.querySelector('#back-link-text');

      if (this.currentStep === 0) {
        // ステップ1: 言語選択に戻る
        const backLabels = { ja: '言語選択', en: 'Language', ko: '언어 선택', 'zh-TW': '語言選擇', 'zh-CN': '语言选择', es: 'Idioma' };
        newBackLink.href = 'index.html';
        newText.textContent = backLabels[this.currentLang] || 'Language';
      } else {
        // ステップ2以降: 前のセクションに戻る
        newBackLink.href = '#';
        newBackLink.addEventListener('click', (e) => { e.preventDefault(); this.goToPrev(); });
        // 前セクション名を表示
        let prevStep = this.currentStep - 1;
        while (prevStep >= 0 && this.shouldSkipStep(this.steps[prevStep])) prevStep--;
        const prevSectionName = prevStep >= 0 ? texts.sections[this.steps[prevStep]] : '';
        newText.textContent = prevSectionName;
      }
    }

    // ステッパー更新
    this.renderStepper(texts);

    // フィールド描画
    this.fieldsArea.innerHTML = '';
    const animClass = this.direction > 0 ? 'slide-in-right' : 'slide-in-left';
    
    const fieldsWrapper = document.createElement('div');
    fieldsWrapper.className = `space-y-6 ${animClass}`;

    // 同セクション内の全フィールドを取得（conditionは表示時に評価）
    const sectionFields = CONFIG.fields.filter(f => {
      if (f.section !== sectionNum) return false;
      if (f.id === 'furigana' && this.currentLang !== 'ja') return false;
      return true;
    });

    sectionFields.forEach(field => {
      const fieldWrapper = document.createElement('div');
      fieldWrapper.id = `field-wrapper-${field.id}`;

      // 条件分岐フィールドの初期表示状態
      if (field.condition && typeof field.condition === 'function') {
        if (!field.condition(this.answers)) {
          fieldWrapper.style.display = 'none';
        }
      }

      // Label
      if (field.type !== 'checkbox' || field.options) {
        const label = document.createElement('label');
        label.className = 'block text-sm font-medium text-sumi/80 mb-2';
        label.setAttribute('for', field.id);
        const labelText = document.createTextNode(texts.labels[field.id] + ' ');
        label.appendChild(labelText);
        if (field.required) {
          const req = document.createElement('span');
          req.className = 'text-shu text-xs font-bold';
          req.textContent = '*';
          label.appendChild(req);
        }
        fieldWrapper.appendChild(label);

        // ヘルパーテキスト（フィールド別の補足説明）
        if (texts.helpers && texts.helpers[field.id]) {
          const helper = document.createElement('p');
          helper.className = 'text-xs text-sumi/50 mb-2 leading-relaxed';
          helper.textContent = texts.helpers[field.id];
          fieldWrapper.appendChild(helper);
        }
      }

      const inputEl = this.buildFieldInput(field, texts);
      fieldWrapper.appendChild(inputEl);
      fieldsWrapper.appendChild(fieldWrapper);
    });

    this.fieldsArea.appendChild(fieldsWrapper);

    // セクション5: マニュアル未閲覧ならagree_termsを無効化
    if (sectionNum === 5 && CONFIG.manual_url && !this._manualOpened) {
      const agreeWrapper = document.getElementById('field-wrapper-agree_terms');
      if (agreeWrapper) {
        agreeWrapper.style.opacity = '0.4';
        agreeWrapper.style.pointerEvents = 'none';
      }
    }

    // ナビゲーションボタン更新
    this.updateNavButtons(texts);
  }

  updateNavButtons(texts) {
    const isFirst = this.currentStep === 0;
    const isLast = this.currentStep === this.steps.length - 1 || 
                   (this.currentStep === this.steps.length - 2 && this.shouldSkipStep(this.steps[this.steps.length - 1]));

    // Check if this is truly the last visible step
    let hasMoreSteps = false;
    for (let i = this.currentStep + 1; i < this.steps.length; i++) {
      if (!this.shouldSkipStep(this.steps[i])) { hasMoreSteps = true; break; }
    }

    // 戻るボタン
    this.prevBtn.style.display = isFirst ? 'none' : '';

    // 次へ / 送信ボタン
    const submitLabels = { ja: '送信する', en: 'Submit', ko: '제출하기', 'zh-TW': '送出', 'zh-CN': '提交', es: 'Enviar' };
    const nextLabels = { ja: '次へ', en: 'Next', ko: '다음', 'zh-TW': '下一步', 'zh-CN': '下一步', es: 'Siguiente' };
    const prevLabels = { ja: '戻る', en: 'Back', ko: '뒤로', 'zh-TW': '返回', 'zh-CN': '返回', es: 'Volver' };

    this.prevText.textContent = prevLabels[this.currentLang] || 'Back';

    if (!hasMoreSteps) {
      this.nextText.textContent = submitLabels[this.currentLang] || 'Submit';
      this.nextArrow.classList.add('hidden');
    } else {
      this.nextText.textContent = nextLabels[this.currentLang] || 'Next';
      this.nextArrow.classList.remove('hidden');
    }

    // 戻るリンク（ステップ0 → index.html, ステップ1以降 → 前へ）
    if (isFirst) {
      this.backLink.href = 'index.html';
    } else {
      this.backLink.href = '#';
      this.backLink.onclick = (e) => { e.preventDefault(); this.goToPrev(); };
    }
  }

  // ========== ステップ遷移 ==========
  goToNext() {
    const texts = CONFIG.i18n[this.currentLang];

    // イントロページから最初のフォームステップへ
    if (this.currentStep === -1) {
      this.direction = 1;
      this.currentStep = 0;
      this.nextBtn.disabled = false;
      this.nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      this.renderStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 現在のステップのバリデーション
    if (!this.validateCurrentStep()) return;

    // 次のステップを探す（スキップ対象をジャンプ）
    let nextStep = this.currentStep + 1;
    while (nextStep < this.steps.length && this.shouldSkipStep(this.steps[nextStep])) {
      nextStep++;
    }

    if (nextStep >= this.steps.length) {
      // 最後のステップ → 送信
      this.handleSubmit(texts);
      return;
    }

    this.direction = 1;
    this.currentStep = nextStep;
    this.renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToPrev() {
    let prevStep = this.currentStep - 1;
    while (prevStep >= 0 && this.shouldSkipStep(this.steps[prevStep])) {
      prevStep--;
    }
    if (prevStep < 0) return;

    this.direction = -1;
    this.currentStep = prevStep;
    this.renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========== バリデーション ==========
  validateCurrentStep() {
    // TODO: 本番リリース前にこの行を削除すること
    return true;
    const sectionNum = this.currentSectionNum;
    const sectionFields = CONFIG.fields.filter(f => {
      if (f.section !== sectionNum) return false;
      if (f.id === 'furigana' && this.currentLang !== 'ja') return false;
      return true;
    });

    let firstInvalid = null;
    sectionFields.forEach(field => {
      if (!field.required) return;
      const val = this.answers[field.id];
      if (field.type === 'date-select') {
        if (!val || !val.year || !val.month || !val.day) {
          if (!firstInvalid) firstInvalid = field.id;
        }
      } else if (!val || val === '' || (Array.isArray(val) && val.length === 0)) {
        if (!firstInvalid) firstInvalid = field.id;
      }
    });

    if (firstInvalid) {
      const el = document.getElementById(firstInvalid);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Flash red border
        if (el.style) {
          el.style.borderColor = '#C53D43';
          setTimeout(() => { el.style.borderColor = ''; }, 1500);
        }
      }
      return false;
    }
    return true;
  }

  // ========== 送信 ==========
  async handleSubmit(texts) {
    // ボタンをローディング状態にする
    this.nextText.textContent = texts.buttons?.submitting || '送信中...';
    this.nextArrow.classList.add('hidden');
    const spinner = document.getElementById('submit-spinner');
    if (spinner) spinner.classList.remove('hidden');
    this.nextBtn.disabled = true;

    console.log('Form Data (テスト — 未送信):', this.answers);
    
    // ダミーの送信待機時間
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 送信完了画面を表示
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // 背景のスクロール禁止
    }
  }

  // ========== フィールド構築 ==========
  buildFieldInput(field, texts) {
    let inputEl;

    if (field.type === 'date-select') {
      inputEl = this.buildDateSelect(field);

    } else if (field.type === 'postal-code') {
      // 郵便番号専用UI（zipcloud API連携）
      inputEl = this.buildPostalCodeField(field, texts);

    } else if (field.type === 'textarea') {
      inputEl = document.createElement('textarea');
      inputEl.className = 'form-input';
      inputEl.id = field.id;
      inputEl.placeholder = (texts.placeholders && texts.placeholders[field.id]) || '';
      inputEl.value = this.answers[field.id] || '';
      inputEl.addEventListener('input', (e) => this.handleInput(field.id, e.target.value));

    } else if (field.type === 'radio' && field.options) {
      inputEl = document.createElement('div');
      // オプションが1つの場合は中央揃え＆半分の幅、複数ある場合は均等割り付け
      inputEl.className = field.options.length === 1 ? 'flex gap-3 max-w-[50%] mx-auto' : 'flex gap-3';
      field.options.forEach(optVal => {
        const pill = document.createElement('div');
        pill.className = 'pill-radio flex-1 relative';
        const rb = document.createElement('input');
        rb.type = 'radio'; rb.name = field.id; rb.value = optVal;
        rb.id = `${field.id}_${optVal}`;
        if (this.answers[field.id] === optVal) rb.checked = true;
        rb.addEventListener('change', (e) => {
          this.handleInput(field.id, e.target.value);
          // 同セクション内の条件分岐フィールドを表示/非表示
          this.updateConditionalFields();
        });

        const rLabel = document.createElement('label');
        rLabel.setAttribute('for', `${field.id}_${optVal}`);
        rLabel.className = 'pill-label';
        rLabel.textContent = texts.options[optVal];

        pill.appendChild(rb);
        pill.appendChild(rLabel);
        inputEl.appendChild(pill);
      });

    } else if (field.type === 'checkbox' && !field.options) {
      inputEl = document.createElement('div');
      inputEl.className = 'flex items-start gap-3 p-4 rounded-lg bg-kinu border border-sumi/[0.06]';
      const cb = document.createElement('input');
      cb.type = 'checkbox'; cb.id = field.id;
      cb.className = 'custom-checkbox mt-0.5 flex-shrink-0';
      cb.checked = this.answers[field.id] === true;
      cb.addEventListener('change', (e) => this.handleInput(field.id, e.target.checked));

      const cbLabel = document.createElement('label');
      cbLabel.setAttribute('for', field.id);
      cbLabel.className = 'text-sm text-sumi/80 font-medium cursor-pointer leading-relaxed';
      cbLabel.textContent = texts.labels[field.id];
      inputEl.appendChild(cb);
      inputEl.appendChild(cbLabel);

    } else if (field.type === 'checkbox-group' && field.options) {
      inputEl = document.createElement('div');
      inputEl.className = 'space-y-3';
      const currentArr = this.answers[field.id] || [];
      field.options.forEach(optVal => {
        const cbWrapper = document.createElement('div');
        cbWrapper.className = 'flex items-center gap-3';
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.value = optVal;
        cb.id = `${field.id}_${optVal}`;
        cb.className = 'custom-checkbox flex-shrink-0';
        cb.checked = currentArr.includes(optVal);
        cb.addEventListener('change', (e) => {
          let newArr = [...(this.answers[field.id] || [])];
          if (e.target.checked) newArr.push(optVal);
          else newArr = newArr.filter(v => v !== optVal);
          this.handleInput(field.id, newArr);
          const otherContainer = document.getElementById(`${field.id}_other_container`);
          if (optVal === 'other' && otherContainer) {
            otherContainer.style.display = e.target.checked ? '' : 'none';
          }
        });

        const cbLabel = document.createElement('label');
        cbLabel.setAttribute('for', `${field.id}_${optVal}`);
        cbLabel.className = 'text-sm text-sumi/80 cursor-pointer';
        cbLabel.textContent = texts.options[optVal];
        cbWrapper.appendChild(cb);
        cbWrapper.appendChild(cbLabel);
        inputEl.appendChild(cbWrapper);

        if (optVal === 'other') {
          const otherContainer = document.createElement('div');
          otherContainer.id = `${field.id}_other_container`;
          otherContainer.style.display = currentArr.includes('other') ? '' : 'none';
          const otherInput = document.createElement('input');
          otherInput.type = 'text';
          otherInput.className = 'form-input mt-2 ml-8 text-sm';
          otherInput.style.width = 'calc(100% - 2rem)';
          otherInput.placeholder = (texts.placeholders && texts.placeholders.other) || '';
          otherInput.value = this.answers[`${field.id}_other_text`] || '';
          otherInput.addEventListener('input', (e) => this.handleInput(`${field.id}_other_text`, e.target.value));
          otherContainer.appendChild(otherInput);
          inputEl.appendChild(otherContainer);
        }
      });

    } else if (field.type === 'file') {
      inputEl = document.createElement('div');
      const fileInput = document.createElement('input');
      fileInput.type = 'file'; fileInput.id = field.id;
      fileInput.accept = field.accept || 'image/*';
      if (field.capture) fileInput.setAttribute('capture', field.capture);
      fileInput.className = 'hidden';

      const dropZone = document.createElement('label');
      dropZone.setAttribute('for', field.id);
      dropZone.className = 'upload-zone' + (this.answers[field.id] ? ' selected' : '');

      const isCapture = !!field.capture;
      const cameraIcon = '<svg class="h-10 w-10 text-sumi/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>';
      const uploadIcon = '<svg class="h-10 w-10 text-sumi/30 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const doneIcon = '<svg class="h-10 w-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

      const defaultLabel = isCapture ? (texts.buttons.capture_photo || texts.buttons.select_file) : texts.buttons.select_file;
      const doneLabel = isCapture ? (texts.buttons.photo_done || 'Done') : 'Image selected';

      const icon = document.createElement('div');
      icon.innerHTML = this.answers[field.id] ? doneIcon : (isCapture ? cameraIcon : uploadIcon);

      const textSpan = document.createElement('span');
      textSpan.className = 'text-sm font-medium ' + (this.answers[field.id] ? 'text-green-700' : 'text-sumi/60');
      textSpan.textContent = this.answers[field.id] ? (this.answers[field.id].name || doneLabel) : defaultLabel;

      const hintSpan = document.createElement('span');
      hintSpan.className = 'text-xs text-sumi/30 mt-1';
      hintSpan.textContent = this.answers[field.id] ? '' : (isCapture ? 'max 5MB' : 'JPEG, PNG (max 5MB)');

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleInput(field.id, file);
          textSpan.textContent = isCapture ? (texts.buttons.photo_done || 'Done') : file.name;
          textSpan.className = 'text-sm font-medium text-green-700';
          icon.innerHTML = doneIcon;
          dropZone.classList.add('selected');
          hintSpan.textContent = '';
        }
      });

      dropZone.appendChild(icon);
      dropZone.appendChild(textSpan);
      dropZone.appendChild(hintSpan);
      inputEl.appendChild(dropZone);
      inputEl.appendChild(fileInput);

    } else if (field.type === 'date') {
      // 日付フィールド（到着日/出発日）
      inputEl = document.createElement('input');
      inputEl.type = 'date';
      inputEl.className = 'form-input';
      inputEl.id = field.id;

      const today = new Date().toISOString().split('T')[0];

      if (field.id === 'arrival_date') {
        inputEl.min = today;
        // デフォルト = 本日
        if (!this.answers[field.id]) this.answers[field.id] = today;
        inputEl.value = this.answers[field.id];
        
        inputEl.addEventListener('change', (e) => {
          this.handleInput(field.id, e.target.value);
          // 出発日を到着日+1日に自動更新（まだ手動変更されていない場合）
          const arrDate = new Date(e.target.value);
          arrDate.setDate(arrDate.getDate() + 1);
          const nextDay = arrDate.toISOString().split('T')[0];
          // 出発日のinputがあれば更新
          const depInput = document.getElementById('departure_date');
          if (depInput) {
            depInput.min = e.target.value;
            if (!this.answers['departure_date'] || this.answers['departure_date'] <= e.target.value) {
              depInput.value = nextDay;
              this.answers['departure_date'] = nextDay;
            }
          } else {
            // まだレンダリングされていない場合、answersだけセット
            this.answers['departure_date'] = nextDay;
          }
        });
      } else if (field.id === 'departure_date') {
        const arrivalVal = this.answers['arrival_date'] || today;
        inputEl.min = arrivalVal;
        // デフォルト = 到着日+1日
        if (!this.answers[field.id]) {
          const d = new Date(arrivalVal);
          d.setDate(d.getDate() + 1);
          this.answers[field.id] = d.toISOString().split('T')[0];
        }
        inputEl.value = this.answers[field.id];
        inputEl.addEventListener('change', (e) => this.handleInput(field.id, e.target.value));
      }

    } else if (field.type === 'time') {
      // 時間フィールド（30分刻みプルダウン）
      inputEl = this.buildTimeSelect(field);

    } else {
      inputEl = document.createElement('input');
      inputEl.type = field.type;
      inputEl.className = 'form-input';
      inputEl.id = field.id;
      if (texts.placeholders && texts.placeholders[field.id]) {
        inputEl.placeholder = texts.placeholders[field.id];
      }
      inputEl.value = this.answers[field.id] || '';
      inputEl.addEventListener('input', (e) => this.handleInput(field.id, e.target.value));
    }

    return inputEl;
  }

  // ========== 生年月日プルダウン ==========
  buildDateSelect(field) {
    const container = document.createElement('div');
    container.className = 'flex gap-2';
    container.id = field.id;
    const currentYear = new Date().getFullYear();
    const saved = this.answers[field.id] || {};

    const yearSelect = this.createSelect(`${field.id}_year`,
      this.currentLang === 'ja' ? '年' : 'Year',
      Array.from({ length: currentYear - 1919 }, (_, i) => ({ value: String(currentYear - i), label: String(currentYear - i) })),
      saved.year || ''
    );
    yearSelect.className += ' flex-[1.2]';

    const monthSelect = this.createSelect(`${field.id}_month`,
      this.currentLang === 'ja' ? '月' : 'Month',
      Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
      saved.month || ''
    );

    const daySelect = this.createSelect(`${field.id}_day`,
      this.currentLang === 'ja' ? '日' : 'Day',
      Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
      saved.day || ''
    );

    const updateDate = () => {
      this.answers[field.id] = {
        year: yearSelect.querySelector('select').value,
        month: monthSelect.querySelector('select').value,
        day: daySelect.querySelector('select').value,
      };
    };
    yearSelect.querySelector('select').addEventListener('change', updateDate);
    monthSelect.querySelector('select').addEventListener('change', updateDate);
    daySelect.querySelector('select').addEventListener('change', updateDate);

    container.appendChild(yearSelect);
    container.appendChild(monthSelect);
    container.appendChild(daySelect);
    return container;
  }

  createSelect(id, placeholder, options, selectedValue) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex-1 relative';
    const select = document.createElement('select');
    select.id = id;
    select.className = 'form-input appearance-none pr-8 cursor-pointer';
    select.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7365' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";
    select.style.backgroundRepeat = 'no-repeat';
    select.style.backgroundPosition = 'right 0.75rem center';

    const defaultOpt = document.createElement('option');
    defaultOpt.value = ''; defaultOpt.textContent = placeholder;
    defaultOpt.disabled = true;
    if (!selectedValue) defaultOpt.selected = true;
    select.appendChild(defaultOpt);

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value; option.textContent = opt.label;
      if (opt.value === selectedValue) option.selected = true;
      select.appendChild(option);
    });

    wrapper.appendChild(select);
    return wrapper;
  }

  // ========== 時間プルダウン（30分刻み） ==========
  buildTimeSelect(field) {
    const timeOptions = [];
    // 到着時間: 15:00〜23:30 / 出発時間: 6:00〜10:00
    let startH = 0, endH = 24;
    if (field.id === 'arrival_time') { startH = 15; endH = 24; }
    else if (field.id === 'departure_time') { startH = 6; endH = 11; }

    for (let h = startH; h < endH; h++) {
      for (let m = 0; m < 60; m += 30) {
        // 出発時間は10:00まで（10:30は含めない）
        if (field.id === 'departure_time' && h === 10 && m > 0) continue;
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const value = `${hh}:${mm}`;
        // 日本語は24時間表記、それ以外はAM/PM
        let label;
        if (this.currentLang === 'ja') {
          label = value;
        } else {
          const h12 = h % 12 || 12;
          const ampm = h < 12 ? 'AM' : 'PM';
          label = `${h12}:${mm} ${ampm}`;
        }
        timeOptions.push({ value, label });
      }
    }

    const placeholderLabels = {
      ja: '時間を選択', en: 'Select time', ko: '시간 선택',
      'zh-TW': '選擇時間', 'zh-CN': '选择时间', es: 'Seleccionar hora'
    };

    const wrapper = this.createSelect(
      field.id,
      placeholderLabels[this.currentLang] || 'Select time',
      timeOptions,
      this.answers[field.id] || ''
    );

    wrapper.querySelector('select').addEventListener('change', (e) => {
      this.handleInput(field.id, e.target.value);
    });

    return wrapper;
  }

  // ========== ハウスマニュアル閲覧後のagree_terms有効化 ==========
  enableAgreeField() {
    const agreeWrapper = document.getElementById('field-wrapper-agree_terms');
    if (agreeWrapper) {
      agreeWrapper.style.opacity = '1';
      agreeWrapper.style.pointerEvents = 'auto';
    }
  }

  // ========== ステッパーUI生成 ==========
  renderStepper(texts) {
    this.stepperContainer.innerHTML = '';
    
    const visibleSteps = this.steps.filter(s => !this.shouldSkipStep(s));
    const currentVisIdx = this.currentVisibleIndex;

    // 1行: ステップカラム(ドット+ラベル)とラインを交互配置
    const row = document.createElement('div');
    row.className = 'flex items-start w-full';

    visibleSteps.forEach((sectionNum, i) => {
      const isActive = i === currentVisIdx;
      const isDone = i < currentVisIdx;

      // ステップカラム（ドット + ラベル 縦並び中央揃え）
      const stepCol = document.createElement('div');
      stepCol.style.cssText = 'display:flex;flex-direction:column;align-items:center;min-width:0;';

      const dot = document.createElement('div');
      dot.className = 'stepper-dot' + (isActive ? ' active' : '') + (isDone ? ' done' : '');
      stepCol.appendChild(dot);

      const label = document.createElement('div');
      label.className = 'stepper-label' + (isActive ? ' active' : '') + (isDone ? ' done' : '');
      label.style.cssText = 'margin-top:6px;text-align:center;white-space:nowrap;';
      label.textContent = this.getStepperLabels(texts, sectionNum);
      stepCol.appendChild(label);

      row.appendChild(stepCol);

      // ライン（ドットの中心高さに合わせる）
      if (i < visibleSteps.length - 1) {
        const line = document.createElement('div');
        line.className = 'stepper-line' + (isDone ? ' done' : '');
        line.style.cssText = 'flex:1;margin-top:4px;min-width:8px;';
        row.appendChild(line);
      }
    });

    this.stepperContainer.appendChild(row);
  }

  getStepperLabels(texts, sectionNum) {
    return (texts.stepperLabels && texts.stepperLabels[sectionNum]) || texts.sections[sectionNum] || '';
  }

  // ========== 条件分岐フィールドの表示切替 ==========
  updateConditionalFields() {
    CONFIG.fields.forEach(field => {
      if (!field.condition || typeof field.condition !== 'function') return;
      const wrapper = document.getElementById(`field-wrapper-${field.id}`);
      if (!wrapper) return;
      
      const shouldShow = field.condition(this.answers);
      if (shouldShow && wrapper.style.display === 'none') {
        wrapper.style.display = '';
        wrapper.style.animation = 'fadeInUp 0.3s ease-out';
      } else if (!shouldShow) {
        wrapper.style.display = 'none';
      }
    });
  }

  // ========== 郵便番号フィールド（zipcloud API連携） ==========
  buildPostalCodeField(field, texts) {
    const container = document.createElement('div');

    const inputRow = document.createElement('div');
    inputRow.className = 'flex gap-2 items-center w-full';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-input flex-1 min-w-0';
    input.id = field.id;
    input.inputMode = 'numeric';
    input.maxLength = 8;
    input.placeholder = (texts.placeholders && texts.placeholders[field.id]) || '';
    input.value = this.answers[field.id] || '';

    const statusIcon = document.createElement('span');
    statusIcon.className = 'text-sm flex-shrink-0 w-6 h-6 flex items-center justify-center';
    statusIcon.id = 'postal-status';

    input.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      // ハイフン自動挿入
      if (raw.length > 3) {
        e.target.value = raw.slice(0, 3) + '-' + raw.slice(3, 7);
      } else {
        e.target.value = raw;
      }
      this.handleInput(field.id, e.target.value);

      // 7桁でAPI呼び出し
      if (raw.length === 7) {
        this.lookupPostalCode(raw, statusIcon);
      } else {
        statusIcon.innerHTML = '';
      }
    });

    inputRow.appendChild(input);
    inputRow.appendChild(statusIcon);
    container.appendChild(inputRow);

    return container;
  }

  async lookupPostalCode(zipcode, statusIcon) {
    statusIcon.innerHTML = '<svg class="animate-spin h-5 w-5 text-sumi/30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const r = data.results[0];
        // 都道府県・市区町村を自動入力
        this.answers['prefecture'] = r.address1;
        this.answers['city'] = r.address2 + r.address3;

        // DOMも更新
        const prefInput = document.getElementById('prefecture');
        const cityInput = document.getElementById('city');
        if (prefInput) prefInput.value = r.address1;
        if (cityInput) cityInput.value = r.address2 + r.address3;

        statusIcon.innerHTML = '<svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
      } else {
        statusIcon.innerHTML = '<svg class="h-5 w-5 text-shu" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
      }
    } catch {
      statusIcon.innerHTML = '';
    }
  }

  handleInput(fieldId, value) {
    this.answers[fieldId] = value;
  }

  // ========== イントロページ描画 ==========
  renderIntroPage(texts) {
    const intro = texts.intro;
    if (!intro) {
      // introがない言語はスキップしてフォームへ
      this.currentStep = 0;
      this.renderStep();
      return;
    }

    // ステッパー非表示
    this.stepperContainer.innerHTML = '';

    // ヘッダー非表示
    this.stepTitle.textContent = '';
    this.stepTitle.style.display = 'none';
    this.stepDesc.innerHTML = '';

    // 戻るリンク = 言語選択へ
    const backLink = document.getElementById('back-link');
    const backLinkText = document.getElementById('back-link-text');
    if (backLink && backLinkText) {
      const newBackLink = backLink.cloneNode(true);
      backLink.parentNode.replaceChild(newBackLink, backLink);
      const newText = newBackLink.querySelector('#back-link-text');
      const backLabels = { ja: '言語選択', en: 'Language', ko: '언어 선택', 'zh-TW': '語言選擇', 'zh-CN': '语言选择', es: 'Idioma' };
      newBackLink.href = 'index.html';
      newText.textContent = backLabels[this.currentLang] || 'Language';
    }

    // フィールドエリアにイントロコンテンツを描画
    this.fieldsArea.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-6 fade-up';

    // メイン説明文
    const mainP = document.createElement('p');
    mainP.className = 'text-sm text-sumi/70 leading-relaxed';
    mainP.innerHTML = intro.main.replace(/\n/g, '<br>');
    wrapper.appendChild(mainP);

    // 登録内容（新たに追加）
    if (intro.content) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'bg-kinu/50 border border-sumi/[0.08] shadow-sm rounded-xl p-5 md:p-6';
      const contentP = document.createElement('p');
      contentP.className = 'text-sm text-sumi/80 leading-relaxed whitespace-pre-line';
      contentP.textContent = intro.content;
      contentDiv.appendChild(contentP);
      wrapper.appendChild(contentDiv);
    }

    // 外国人向けセクション
    const foreignDiv = document.createElement('div');
    foreignDiv.className = 'bg-kinu/50 border border-sumi/[0.08] shadow-sm rounded-xl p-5 md:p-6';
    const foreignP = document.createElement('p');
    foreignP.className = 'text-xs text-sumi/60 leading-relaxed whitespace-pre-line';
    foreignP.textContent = intro.foreign;
    foreignDiv.appendChild(foreignP);
    wrapper.appendChild(foreignDiv);

    // 区切り線
    const hr = document.createElement('div');
    hr.className = 'border-t border-sumi/[0.08] my-6';
    wrapper.appendChild(hr);

    // 所要時間（ここで一番下に追加）
    const timeDiv = document.createElement('div');
    timeDiv.className = 'flex items-center justify-center gap-2 text-sm font-medium text-sumi/80 bg-kinu/80 border border-sumi/[0.08] shadow-sm rounded-xl px-5 py-3 mb-6 mx-auto w-fit';
    timeDiv.innerHTML = `<svg class="w-4 h-4 text-shu flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>${intro.time}</span>`;
    wrapper.appendChild(timeDiv);

    // 同意チェックボックス
    const agreeRow = document.createElement('div');
    agreeRow.className = 'flex items-center justify-center gap-3';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'intro-agree';
    cb.className = 'custom-checkbox flex-shrink-0';
    const cbLabel = document.createElement('label');
    cbLabel.setAttribute('for', 'intro-agree');
    cbLabel.className = 'text-sm text-sumi/80 font-medium cursor-pointer';
    cbLabel.textContent = intro.agree;
    agreeRow.appendChild(cb);
    agreeRow.appendChild(cbLabel);
    wrapper.appendChild(agreeRow);

    this.fieldsArea.appendChild(wrapper);

    // ナビゲーションボタン
    this.prevBtn.style.display = 'none';
    this.nextText.textContent = intro.start;
    this.nextArrow.classList.remove('hidden');
    this.nextBtn.disabled = true;
    this.nextBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // チェックボックスでボタン活性化
    cb.addEventListener('change', () => {
      this.nextBtn.disabled = !cb.checked;
      if (cb.checked) {
        this.nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        this.nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    });
  }

  setupEventListeners() {
    this.nextBtn.addEventListener('click', () => this.goToNext());
    this.prevBtn.addEventListener('click', () => this.goToPrev());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.checkinApp = new CheckinForm();
});
