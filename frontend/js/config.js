/**
 * Shigetomi Check-in System v2.0
 * Configuration & Localization data
 */

export const CONFIG = {
  // Supported languages
  languages: [
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
    { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ],

  // Form Field Definitions (JSON Driven)
  fields: [
    {
      id: 'full_name',
      type: 'text',
      required: true,
      section: 1
    },
    {
      id: 'furigana',
      type: 'text',
      required: true,
      section: 1,
      condition: (lang) => lang === 'ja'
    },
    {
      id: 'birth_date',
      type: 'date-select',
      required: true,
      section: 1
    },
    {
      id: 'phone_number',
      type: 'tel',
      required: true,
      section: 1
    },
    {
      id: 'has_domestic_address',
      type: 'radio',
      required: true,
      section: 2,
      options: ['yes', 'no']
    },
    {
      id: 'postal_code',
      type: 'postal-code',
      required: true,
      section: 2,
      condition: (answers) => answers.has_domestic_address === 'yes'
    },
    {
      id: 'prefecture',
      type: 'text',
      required: true,
      section: 2,
      condition: (answers) => answers.has_domestic_address === 'yes'
    },
    {
      id: 'city',
      type: 'text',
      required: true,
      section: 2,
      condition: (answers) => answers.has_domestic_address === 'yes'
    },
    {
      id: 'street',
      type: 'text',
      required: true,
      section: 2,
      condition: (answers) => answers.has_domestic_address === 'yes'
    },
    {
      id: 'building',
      type: 'text',
      required: false,
      section: 2,
      condition: (answers) => answers.has_domestic_address === 'yes'
    },
    {
      id: 'foreign_address',
      type: 'textarea',
      required: true,
      section: 2,
      condition: (answers) => answers.has_domestic_address === 'no'
    },
    {
      id: 'nationality',
      type: 'text',
      required: true,
      section: 3,
      condition: (answers) => answers.has_domestic_address === 'no'
    },
    {
      id: 'passport_number',
      type: 'text',
      required: true,
      section: 3,
      condition: (answers) => answers.has_domestic_address === 'no'
    },
    {
      id: 'passport_photo',
      type: 'file',
      required: true,
      section: 3,
      accept: 'image/*',
      condition: (answers) => answers.has_domestic_address === 'no'
    },
    {
      id: 'arrival_date',
      type: 'date',
      required: true,
      section: 4
    },
    {
      id: 'arrival_time',
      type: 'time',
      required: true,
      section: 4
    },
    {
      id: 'departure_date',
      type: 'date',
      required: true,
      section: 4
    },
    {
      id: 'departure_time',
      type: 'time',
      required: true,
      section: 4
    },
    {
      id: 'agree_terms',
      type: 'radio',
      required: true,
      section: 5,
      options: ['yes']
    },
    {
      id: 'visit_purposes',
      type: 'checkbox-group',
      required: false,
      section: 6,
      options: ['tourism', 'business', 'ceremony', 'school', 'homecoming', 'other']
    }
  ],

  // Localization Dictionary
  i18n: {
    ja: {
      title: "チェックイン情報登録",
      description: "当施設は旅館業法に基づき、すべての宿泊者様へ情報登録をお願いしております。",
      descriptions: {
        1: "旅館業法の規定により、すべてのお客様の情報を宿泊者名簿に記載し、3年間保存する義務がございます。\n公的な身分証明書またはパスポートに記載の氏名を正確にご入力ください。",
        2: "旅館業法に基づき、ご宿泊者様の住所の記載が必要です。\n日本国内にお住まいの方は日本の住所を、日本国外にお住まいの方は本国の住所をご記入ください。",
        3: "旅館業法施行規則第4条の2に基づき、日本国内に住所を有しない外国人のお客様には以下の情報のご提供をお願いしております。\nご提供いただいた旅券の写しは、宿泊者名簿とともに3年間保存いたします。",
        4: "ご到着・ご出発の予定日時をご記入ください。\nチェックイン: 15:00以降 ／ チェックアウト: 10:00まで\n※上記時間外をご希望の場合は、事前にお電話にてご連絡ください。",
        5: "【宿泊約款・利用規約のご確認】\nご宿泊にあたり、当施設のハウスマニュアルをご確認ください。\n▼ ハウスマニュアル: [Link URL]\n\n【重要】\n★ 館内は全面禁煙です。喫煙は庭でお願いします。\n★ 住宅街のため、騒音にはくれぐれもご注意ください。\n\n内容をご確認の上、同意いただける場合は「はい」を選択してください。\n※同意いただけない場合はご宿泊いただけません。",
        6: "今後のサービス向上および運営改善の参考とさせていただきます。"
      },
      sections: {
        1: "基本情報",
        2: "居住地の確認",
        3: "外国人必須情報",
        4: "滞在日程",
        5: "最終同意",
        6: "簡単なアンケートにご協力をお願いいたします"
      },
      stepperLabels: {
        1: "基本情報",
        2: "居住地",
        3: "パスポート",
        4: "日程",
        5: "同意",
        6: "アンケート"
      },
      labels: {
        full_name: "宿泊者氏名",
        furigana: "ふりがな",
        birth_date: "生年月日",
        phone_number: "連絡先（電話番号）",
        has_domestic_address: "日本国内に住所がありますか？",
        postal_code: "郵便番号",
        prefecture: "都道府県",
        city: "市区町村",
        street: "番地",
        building: "建物名・部屋番号",
        foreign_address: "住所（本国の住所）",
        nationality: "国籍",
        passport_number: "旅券番号（パスポート番号）",
        passport_photo: "旅券の写し（顔写真ページ）",
        arrival_date: "到着日",
        arrival_time: "到着時間",
        departure_date: "出発日",
        departure_time: "出発時間",
        agree_terms: "利用規約に同意しますか？",
        visit_purposes: "ご宿泊の目的を教えてください。（複数選択可）"
      },
      options: {
        yes: "はい",
        no: "いいえ",
        tourism: "観光",
        business: "仕事（出張・業務）",
        ceremony: "冠婚葬祭",
        school: "学校関係（研修・大会・引率など）",
        homecoming: "帰省",
        other: "その他"
      },
      placeholders: {
        full_name: "例：重富 太郎",
        furigana: "例：しげとみ たろう",
        phone_number: "例：090-1234-5678",
        postal_code: "例：810-0001",
        street: "例：1-2-3",
        building: "例：○○マンション 101号室",
        foreign_address: "本国（普段お住まいの国）の住所をご記入ください",
        other: "その他の理由"
      },
      buttons: {
        submit: "送信する",
        submitting: "送信中...",
        select_file: "ファイルを選択"
      },
      messages: {
        success: "チェックイン情報の登録が完了しました。ありがとうございます。",
        error_general: "エラーが発生しました。もう一度お試しください。",
        error_file_large: "画像サイズが大きすぎます。5MB以下の画像を選択してください。",
        agree_required: "約款・利用規約への同意は必須です。"
      }
    },
    en: {
      title: "Check-in Information",
      description: "Under the Inns and Hotels Act of Japan, we require all guests to register their information.",
      descriptions: {
        1: "Our facility is required by law to record all guests' information in a guest register and retain it for three years.\nPlease enter your name exactly as it appears on your passport or official identification document.",
        2: "Under Japan's Inn Business Act, we are required to record guests' addresses.\nResidents of Japan: please enter your Japanese address. Residents outside Japan: please enter your home country address.",
        3: "Under Article 4-2 of the Enforcement Regulations of Japan's Inn Business Act, foreign guests without an address in Japan are required to provide the following information.\nYour passport copy will be stored alongside the guest register for three years.",
        4: "Please enter your planned arrival and departure dates and times.\nCheck-in: From 15:00 (3:00 PM) \/ Check-out: By 10:00 (10:00 AM)\n*If you wish to check in or out outside these hours, please contact us by phone in advance.*",
        5: "[Review of Accommodation Agreement & House Rules]\nPlease review our House Manual before your stay.\n▼ House Manual: [Link URL]\n\n[IMPORTANT]\n★ The entire facility is non-smoking. Please smoke in the garden only.\n★ As we are in a residential area, please keep noise to a minimum.\n\nPlease select 'Yes' if you agree to the above.\n*If you do not agree, we may not be able to accommodate your stay.*",
        6: "Your responses will help us improve our services and operations going forward."
      },
      sections: {
        1: "Basic Information",
        2: "Residence Confirmation",
        3: "Required Information for Foreign Nationals",
        4: "Stay Schedule",
        5: "Final Agreement",
        6: "Brief Questionnaire"
      },
      stepperLabels: {
        1: "Basics",
        2: "Address",
        3: "Passport",
        4: "Schedule",
        5: "Confirm",
        6: "Survey"
      },
      labels: {
        full_name: "Full Name",
        birth_date: "Date of Birth",
        phone_number: "Phone Number",
        has_domestic_address: "Do you have an address in Japan?",
        postal_code: "Postal Code",
        prefecture: "Prefecture",
        city: "City / Municipality",
        street: "Street Address",
        building: "Building / Room Number",
        foreign_address: "Address (Home Country)",
        nationality: "Nationality",
        passport_number: "Passport Number",
        passport_photo: "Passport Photo (Bio data page)",
        arrival_date: "Arrival Date",
        arrival_time: "Arrival Time",
        departure_date: "Departure Date",
        departure_time: "Departure Time",
        agree_terms: "Do you agree to the Terms and Conditions?",
        visit_purposes: "What is the purpose of your stay? (Multiple choice)"
      },
      options: {
        yes: "Yes",
        no: "No",
        tourism: "Tourism",
        business: "Business",
        ceremony: "Ceremony (Wedding/Funeral)",
        school: "School (Training/Tournament)",
        homecoming: "Homecoming",
        other: "Other"
      },
      placeholders: {
        full_name: "e.g., John Doe",
        phone_number: "+1 234 567 8900",
        postal_code: "e.g., 810-0001",
        street: "e.g., 1-2-3",
        building: "e.g., Apt 101",
        foreign_address: "Please enter your full home country address",
        other: "Please specify"
      },
      buttons: {
        submit: "Submit",
        submitting: "Submitting...",
        select_file: "Select File"
      },
      messages: {
        success: "Check-in information submitted successfully. Thank you.",
        error_general: "An error occurred. Please try again.",
        error_file_large: "File size is too large. Please select an image under 5MB.",
        agree_required: "You must agree to the terms to proceed."
      }
    },
    ko: {
      title: "체크인 정보 등록",
      description: "일본 여관업법에 따라 모든 숙박객의 정보 등록이 필요합니다.",
      descriptions: {
        1: "여관업법에 따라 모든 고객님의 정보를 숙박자 명부에 기재하고 3년간 보존할 의무가 있습니다.\n여권 또는 공식 신분증에 기재된 이름과 정확히 일치하도록 입력해 주십시오.",
        2: "여관업법에 따라 숙박 고객님의 주소 기재가 필요합니다.\n일본 국내 거주자는 일본 주소를, 비거주자는 본국 주소를 기입해 주십시오.",
        3: "여관업법 시행규칙 제4조의2에 따라, 일본 국내에 주소를 보유하지 않은 외국인 고객님께서는 아래 정보를 제공하셔야 합니다.\n제출하신 여권 사본은 숙박자 명부와 함께 3년간 보존됩니다.",
        4: "도착 및 출발 예정 일시를 기입해 주십시오.\n체크인: 15:00 이후 \/ 체크아웃: 10:00까지\n*위 시간 외 체크인\/체크아웃을 희망하시는 경우, 사전에 전화로 문의해 주십시오.*",
        5: "[숙박 약관 및 이용 규정 확인]\n숙박 전 당 시설의 하우스 매뉴얼을 확인해 주십시오.\n▼ 하우스 매뉴얼: [Link URL]\n\n【중요】\n★ 관내 전면 금연입니다. 흡연은 정원에서 부탁드립니다.\n★ 주택가에 위치하고 있으므로 소음에 주의해 주십시오.\n\n내용을 확인하신 후 동의하시면 '예'를 선택해 주십시오.\n※ 동의하지 않으시는 경우 숙박이 불가합니다.",
        6: "향후 서비스 개선 및 운영 향상을 위한 참고 자료로 활용됩니다."
      },
      sections: {
        1: "기본 정보",
        2: "거주지 확인",
        3: "외국인 필수 정보",
        4: "체류 일정",
        5: "최종 동의",
        6: "간단한 설문조사"
      },
      stepperLabels: {
        1: "기본정보",
        2: "거주지",
        3: "여권",
        4: "일정",
        5: "동의",
        6: "설문"
      },
      labels: {
        full_name: "성명",
        birth_date: "생년월일",
        phone_number: "연락처 (전화번호)",
        has_domestic_address: "일본 국내에 주소가 있습니까?",
        postal_code: "우편번호",
        prefecture: "도도부현",
        city: "시구정촌",
        street: "번지",
        building: "건물명·호실",
        foreign_address: "주소 (본국 주소)",
        nationality: "국적",
        passport_number: "여권 번호",
        passport_photo: "여권 사본 (사진 페이지)",
        arrival_date: "도착 날짜",
        arrival_time: "도착 시간",
        departure_date: "출발 날짜",
        departure_time: "출발 시간",
        agree_terms: "이용 약관에 동의하십니까?",
        visit_purposes: "숙박 목적을 선택해 주세요 (복수 선택 가능)"
      },
      options: {
        yes: "예",
        no: "아니요",
        tourism: "관광",
        business: "업무 (출장)",
        ceremony: "관혼상제",
        school: "학교 관련 (연수/대회)",
        homecoming: "귀성",
        other: "기타"
      },
      placeholders: {
        full_name: "예: 홍길동",
        phone_number: "예: 010-1234-5678",
        postal_code: "예: 810-0001",
        street: "예: 1-2-3",
        building: "예: ○○맨션 101호",
        foreign_address: "본국 주소를 입력해 주십시오",
        other: "기타 사유"
      },
      buttons: {
        submit: "제출하기",
        submitting: "제출 중...",
        select_file: "파일 선택"
      },
      messages: {
        success: "체크인 정보 등록이 완료되었습니다. 감사합니다.",
        error_general: "오류가 발생했습니다. 다시 시도해 주세요.",
        error_file_large: "파일이 너무 큽니다. 5MB 이하의 이미지를 선택해 주세요.",
        agree_required: "약관에 동의해야 합니다."
      }
    },
    'zh-TW': {
      // Taiwan / Traditional Chinese (Draft translated)
      title: "入住登記",
      description: "根據日本旅館業法，所有住客皆需進行資訊登記。",
      descriptions: {
        1: "本設施根據旅館業法的規定，有義務將所有入住客人的資訊登記在住宿者名簿上並保存三年。\n請嚴格按照您的護照或官方身份證件上的姓名填寫。",
        2: "根據《旅館業法》的規定，需要登記住宿者的地址。\n居住在日本的客人請填寫日本地址，非居住者請填寫本國地址。",
        3: "根據《旅館業法施行規則》第4條之2的規定，在日本沒有地址的外國客人須提供以下資訊。\n您提交的護照影本將與住宿者名簿一同保存三年。",
        4: "請填寫您計劃抵達和離開的日期和時間。\n入住時間：15:00起 \/ 退房時間：10:00前\n*如果您希望在上述時間以外辦理入住或退房，請提前致電聯繫。*",
        5: "【住宿條款及使用規定確認】\n入住前請確認本設施的房屋手冊。\n▼ 房屋手冊: [Link URL]\n\n【重要】\n★ 館內全面禁煙，請於庭院吸煙。\n★ 本設施位於住宅區，請注意保持安靜。\n\n確認內容後，若同意請選擇「是」。\n※如不同意，將無法安排住宿。",
        6: "您的回覆將有助於我們提升服務品質並改善未來的營運。"
      },
      sections: { 1: "基本資料", 2: "居住地確認", 3: "外籍人士必填資料", 4: "停留日程", 5: "最終同意", 6: "簡單問卷調查" },
      stepperLabels: { 1: "基本資料", 2: "居住地", 3: "護照", 4: "日程", 5: "同意", 6: "問卷" },
      labels: {
        full_name: "姓名", birth_date: "出生日期", phone_number: "聯絡電話",
        has_domestic_address: "是否在日本擁有住址？",
        postal_code: "郵遞區號", prefecture: "都道府縣", city: "市區町村", street: "番地", building: "建築名·房號",
        foreign_address: "地址（本國地址）",
        nationality: "國籍", passport_number: "護照號碼", passport_photo: "護照影本（照片頁）",
        arrival_date: "抵達日期", arrival_time: "抵達時間",
        departure_date: "退房日期", departure_time: "退房時間",
        agree_terms: "您是否同意相關條款與協議？", visit_purposes: "請告知您此次入住的目的。（可複選）"
      },
      options: { yes: "是", no: "否", tourism: "觀光旅遊", business: "商務出差/工作", ceremony: "婚喪等家庭事務", school: "學校相關（研修、比賽、帶隊等）", homecoming: "探親/返鄉", other: "其他" },
      placeholders: { full_name: "例：王小明", phone_number: "例：0912-345-678", postal_code: "例：810-0001", street: "例：1-2-3", building: "例：○○大厦 101號", foreign_address: "請輸入您本國的完整地址", other: "其他原因" },
      buttons: { submit: "送出", submitting: "送出中...", select_file: "選擇檔案" },
      messages: { success: "登記完成，感謝您的配合。", error_general: "發生錯誤，請重試。", error_file_large: "檔案過大，請上傳小於 5MB 的圖片。", agree_required: "必須同意條款才能繼續。" }
    },
    'zh-CN': {
      // Simplified Chinese (Draft translated)
      title: "入住登记",
      description: "根据日本旅馆业法，所有住客均需进行信息登记。",
      descriptions: {
        1: "本设施根据旅馆业法的规定，有义务将所有入住客人的信息登记在住宿者名簿上并保存三年。\n请严格按照您的护照或官方身份证件上的姓名填写。",
        2: "根据《旅馆业法》的规定，需要登记住宿者的地址。\n居住在日本的客人请填写日本地址，非居住者请填写本国地址。",
        3: "根据《旅馆业法施行规则》第4条之2的规定，在日本没有地址的外国客人须提供以下信息。\n您提交的护照复印件将与住宿者名簿一同保存三年。",
        4: "请填写您计划抵达和离开的日期和时间。\n入住时间：15:00起 \/ 退房时间：10:00前\n*如果您希望在上述时间以外办理入住或退房，请提前致电联系。*",
        5: "【住宿条款及使用规定确認】\n入住前请确認本设施的房屋手册。\n▼ 房屋手册: [Link URL]\n\n【重要】\n★ 馆内全面禁烟，请于庭院吸烟。\n★ 本设施位于住宅区，请注意保持安静。\n\n确認内容后，若同意请选择「是」。\n※如不同意，将无法安排住宿。",
        6: "您的回答将帮助我们提升服务质量并改善今后的运营。"
      },
      sections: { 1: "基本信息", 2: "居住地确认", 3: "外籍人士必填信息", 4: "停留日程", 5: "最终同意", 6: "简单问卷调查" },
      stepperLabels: { 1: "基本信息", 2: "居住地", 3: "护照", 4: "日程", 5: "同意", 6: "问卷" },
      labels: {
        full_name: "姓名", birth_date: "出生日期", phone_number: "联系电话",
        has_domestic_address: "是否在日本拥有住址？",
        postal_code: "邮政编码", prefecture: "都道府县", city: "市区町村", street: "番地", building: "建筑名·房号",
        foreign_address: "地址（本国地址）",
        nationality: "国籍", passport_number: "护照号码", passport_photo: "护照复印件（照片页）",
        arrival_date: "抵达日期", arrival_time: "抵达时间",
        departure_date: "退房日期", departure_time: "退房时间",
        agree_terms: "您是否同意相关条款与协议？", visit_purposes: "请告知您本次入住的目的。（可多选）"
      },
      options: { yes: "是", no: "否", tourism: "旅游观光", business: "商务出差/工作", ceremony: "婚丧等家庭事务", school: "学校相关（研修、比赛、带队等）", homecoming: "探亲/返乡", other: "其他" },
      placeholders: { full_name: "例：王小明", phone_number: "例：138-1234-5678", postal_code: "例：810-0001", street: "例：1-2-3", building: "例：○○大厦 101号", foreign_address: "请输入您本国的完整地址", other: "其他原因" },
      buttons: { submit: "提交", submitting: "提交中...", select_file: "选择文件" },
      messages: { success: "登记完成，感谢您的配合。", error_general: "发生错误，请重试。", error_file_large: "文件过大，请上传小于 5MB 的图片。", agree_required: "必须同意条款才能继续。" }
    },
    es: {
      // Spanish (Draft translated)
      title: "Registro de Check-in",
      description: "Según la Ley de Posadas y Hoteles de Japón, todos los huéspedes deben registrar su información.",
      descriptions: {
        1: "Nuestro establecimiento está obligado por ley a registrar la información de todos los huéspedes en un libro de registro y conservarla durante tres años.\nPor favor, ingrese su nombre exactamente como aparece en su pasaporte o documento de identidad oficial.",
        2: "De acuerdo con la Ley de Establecimientos de Alojamiento de Japón, es necesario registrar la dirección del huésped.\nResidentes en Japón: introduzcan su dirección japonesa. No residentes: introduzcan la dirección de su país de origen.",
        3: "De acuerdo con el Artículo 4-2 del Reglamento de Aplicación, los huéspedes extranjeros sin dirección en Japón deben proporcionar la siguiente información.\nLa copia de su pasaporte se conservará junto con el registro de huéspedes durante tres años.",
        4: "Por favor, introduzca las fechas y horas previstas de llegada y salida.\nCheck-in: A partir de las 15:00 \/ Check-out: Hasta las 10:00\n*Si desea realizar el check-in o check-out fuera de este horario, comuníquese con nosotros por teléfono.*",
        5: "[Revisión del Acuerdo de Alojamiento y Normas]\nPor favor, revise nuestro Manual de la Casa antes de su estancia.\n▼ Manual de la Casa: [Link URL]\n\n[IMPORTANTE]\n★ Está totalmente prohibido fumar en el interior. Por favor, fume solo en el jardín.\n★ Nos encontramos en una zona residencial. Le rogamos que mantenga el nivel de ruido al mínimo.\n\nSeleccione 'Sí' si está de acuerdo con lo anterior.\n*Si no está de acuerdo, es posible que no podamos alojarle.*",
        6: "Sus respuestas nos ayudarán a mejorar nuestros servicios y operaciones en el futuro."
      },
      sections: { 1: "Información Básica", 2: "Confirmación de Residencia", 3: "Información Requerida para Extranjeros", 4: "Horario de Estancia", 5: "Acuerdo Final", 6: "Breve Cuestionario" },
      stepperLabels: { 1: "Básico", 2: "Dirección", 3: "Pasaporte", 4: "Fechas", 5: "Acuerdo", 6: "Encuesta" },
      labels: {
        full_name: "Nombre Completo", birth_date: "Fecha de Nacimiento", phone_number: "Número de Teléfono",
        has_domestic_address: "¿Tiene una dirección en Japón?",
        postal_code: "Código Postal", prefecture: "Prefectura", city: "Ciudad / Municipio", street: "Dirección", building: "Edificio / Apartamento",
        foreign_address: "Dirección (País de origen)",
        nationality: "Nacionalidad", passport_number: "Número de Pasaporte", passport_photo: "Foto del Pasaporte (Página de datos)",
        arrival_date: "Fecha de llegada", arrival_time: "Hora de llegada",
        departure_date: "Fecha de salida", departure_time: "Hora de salida",
        agree_terms: "¿Acepta los Términos y Condiciones?", visit_purposes: "¿Cuál es el motivo de su estancia? (Se permiten múltiples respuestas)"
      },
      options: { yes: "Sí", no: "No", tourism: "Turismo", business: "Negocios (viaje de trabajo/trabajo)", ceremony: "Evento familiar (boda, funeral, etc.)", school: "Actividad escolar (formación, competencia, etc.)", homecoming: "Visita a familiares/Regreso a casa", other: "Otro" },
      placeholders: { full_name: "Ej. Juan Pérez", phone_number: "+34 123 456 789", postal_code: "Ej. 810-0001", street: "Ej. 1-2-3", building: "Ej. Apt 101", foreign_address: "Introduzca su dirección completa de su país de origen", other: "Especifique" },
      buttons: { submit: "Enviar", submitting: "Enviando...", select_file: "Seleccionar Archivo" },
      messages: { success: "Información enviada con éxito. Gracias.", error_general: "Ocurrió un error. Por favor, inténtelo de nuevo.", error_file_large: "El archivo es demasiado grande. Seleccione una imagen de menos de 5MB.", agree_required: "Debe aceptar los términos para continuar." }
    }
  }
};
