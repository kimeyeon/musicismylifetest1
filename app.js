// Firebase 연동 임시 보류
// import { db, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query } from './firebase-config.js';

let currentUser = { studentId: 'guest', name: '게스트' };

const categories = [
    { id: 'all', name: '전체 추천' },
    { id: 'season', name: '계절별' },
    { id: 'time', name: '시간대별' },
    { id: 'mood', name: '무드별' },
    { id: 'my-pick', name: '내가 추천하는 음악' }
];

const subCategories = {
    'season': [
        { id: 'season-spring', name: '봄' },
        { id: 'season-summer', name: '여름' },
        { id: 'season-fall', name: '가을' },
        { id: 'season-winter', name: '겨울' }
    ],
    'time': [
        { id: 'time-morning', name: '아침' },
        { id: 'time-lunch', name: '점심' },
        { id: 'time-afternoon', name: '오후' },
        { id: 'time-dawn', name: '새벽' }
    ],
    'mood': [
        { id: 'mood-exciting', name: '신나는' },
        { id: 'mood-workout', name: '운동' },
        { id: 'mood-relax', name: '휴식' },
        { id: 'mood-sad', name: '슬픔' },
        { id: 'mood-party', name: '파티' }
    ]
};

// ───────────────────────────────────────────────────────────
// 2026년 5월 현재 차트 기준 50곡 — 모든 썸네일 100% 하드코딩
// iTunes API 런타임 호출 완전 제거 → 썸네일 문제 영구 해결
// ───────────────────────────────────────────────────────────

const musicData = [
    // ── 현재 멜론 차트 TOP ──
    { id:'m1', youtubeId:'llsR2eTdlI4', title:'REDRED', artist:'CORTIS',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/5f/47/9b5f4711-dc78-2dea-6721-d06709ea5121/198704992810_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b9/a9/23/b9a92352-f4a2-fd4e-c2de-4985bc38133c/mzaf_7598194542973128311.plus.aac.p.m4a',
      likes:9800 },

    { id:'m2', youtubeId:'MePc3CCGX-s', title:'소문의 낙원', artist:'AKMU',
      tags:['time','time-morning','time-lunch','mood','mood-relax','mood-exciting'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/43/aa/35/43aa3529-1776-70fb-fe49-2bb59a7680f2/8800367489775_cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d2/62/19/d26219c9-2b17-7002-0ee7-caf804dbac64/mzaf_9289696188997959827.plus.aac.p.m4a',
      likes:8700 },

    { id:'m3', youtubeId:'SNn_H_Q2moo', title:'기쁨, 슬픔, 아름다운 마음', artist:'AKMU',
      tags:['time','time-morning','mood','mood-relax','mood-sad'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/43/aa/35/43aa3529-1776-70fb-fe49-2bb59a7680f2/8800367489775_cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/db/13/f4/db13f4e6-81ca-0d40-ee89-047c46d7744b/mzaf_13722675252766050209.plus.aac.p.m4a',
      likes:7200 },

    { id:'m4', youtubeId:'xU06iU17sWo', title:"It's Me", artist:'ILLIT',
      tags:['time','time-afternoon','mood','mood-exciting','mood-relax','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/7e/67/e87e6795-4ada-2f65-d562-1fd2a3eddfdf/mzaf_11263458879279601822.plus.aac.p.m4a',
      likes:7500 },

    { id:'m5', youtubeId:'-sl_uVo6WiE', title:'RUDE!', artist:'Hearts2Hearts',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/78/b9/fb/78b9fb30-169a-eab0-38e9-8df725f8f2d6/888735954603.png/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/01/3c/36/013c3684-7121-8f9f-6eb5-00b610ac055c/mzaf_16203782190977593201.plus.aac.p.m4a',
      likes:6300 },

    { id:'m6', youtubeId:'0pU0Xl7PgkE', title:'캐치 캐치 (Catch Catch)', artist:'YENA',
      tags:['time','time-lunch','mood','mood-exciting','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2d/1f/99/2d1f997c-6d8b-c312-2156-c2a1ae969c03/888272177749_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c8/d2/84/c8d28401-51c5-38f2-9755-bbf946295875/mzaf_10572907630694741693.plus.aac.p.m4a',
      likes:5800 },

    { id:'m7', youtubeId:'9qkpcLK422o', title:'BANG BANG', artist:'IVE',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party','mood-workout','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9a/8e/68/9a8e6815-2e20-a486-5818-967109df4763/cover_KM0024105_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/7e/5f/e07e5f06-19a1-1a6d-95d9-5615b56fd125/mzaf_16023007514594622097.plus.aac.p.m4a',
      likes:6100 },

    { id:'m8', youtubeId:'f1sr0D13wEY', title:'사랑하게 될 거야', artist:'한로로',
      tags:['time','time-morning','mood','mood-relax','mood-sad'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c2/ef/87/c2ef8779-f3bb-5a1c-ef6f-c27185e62446/8809936067307.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/14/b0/1d14b0a6-773d-7a46-fc1e-cd9855da0029/mzaf_18331909942495617093.plus.aac.p.m4a',
      likes:5200 },

    { id:'m9', youtubeId:'zhHB4dZTChw', title:'404 (New Era)', artist:'KiiiKiii',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1b/43/f5/1b43f5d0-0a3b-d1e1-bc0a-e572e92e0455/199806885123.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a8/b6/87/a8b687ed-860d-5da9-f9d5-02dc94e98516/mzaf_17275371173713193127.plus.aac.p.m4a',
      likes:4900 },

    { id:'m10', youtubeId:'tiKFuzpX-NA', title:'Drowning', artist:'WOODZ',
      tags:['time','time-dawn','mood','mood-sad','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/91/0d/07910df6-5ab5-0867-3be5-900cf9d11018/cover_KM0016894_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/0f/d8/6f/0fd86fd4-67e1-819e-011e-6dfbb35c543f/mzaf_1219313157550046379.plus.aac.p.m4a',
      likes:4700 },

    { id:'m11', youtubeId:'Jxgbfc89hNI', title:'Suddenly', artist:'I.O.I',
      tags:['time','time-morning','time-lunch','mood','mood-exciting','mood-relax','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4e/f0/d9/4ef0d927-e14f-49c7-b273-e92ed3ce354b/888272181623_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2f/f9/b5/2ff9b590-9405-acb8-4596-f77e680ecc4f/mzaf_4211101374025559833.plus.aac.p.m4a',
      likes:8100 },

    { id:'m12', youtubeId:'01w7CVCW7kY', title:'Heavy Serenade', artist:'NMIXX',
      tags:['time','time-afternoon','mood','mood-exciting','mood-workout','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fe/cd/64/fecd6408-3ace-12b5-7ad7-c5d2ac891168/8809928958262.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/65/c6/d5/65c6d5d6-d7dd-1f17-fdc7-95bd19ae5dd6/mzaf_7764163084838025682.plus.aac.p.m4a',
      likes:4500 },

    { id:'m13', youtubeId:'Qe8fa4b5xNU', title:'Good Goodbye', artist:'화사',
      tags:['time','time-lunch','time-afternoon','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7c/bd/f4/7cbdf4a9-50e6-ec52-7e54-644c80e6b86d/cover_KM0023526_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/98/3f/e7/983fe7ca-6448-c912-7e51-c8816f7c47d1/mzaf_4744868879428946437.plus.aac.p.m4a',
      likes:4300 },

    { id:'m14', youtubeId:'fw77hyiICu8', title:'Popcorn', artist:'D.O.',
      tags:['time','time-morning','mood','mood-relax','mood-exciting'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/f8/7c/c8f87c57-f335-2faa-5260-5bd6de49cc9f/191953349695.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a8/42/0a/a8420a7e-d060-f908-d15c-bb57df421108/mzaf_14221130035911804642.plus.aac.p.m4a',
      likes:4100 },

    { id:'m15', youtubeId:'k3VwwLeorsU', title:'PINKY UP', artist:'KATSEYE',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1a/77/46/1a77460d-493c-a795-92ef-84674905409e/26UMGIM25100.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8a/2d/f8/8a2df8c0-e0d3-d040-5a98-958d4ad25ceb/mzaf_16340910211187354178.plus.aac.p.m4a',
      likes:5600 },

    { id:'m16', youtubeId:'co-TFLbaZAE', title:'Gabriela', artist:'KATSEYE',
      tags:['time','time-lunch','mood','mood-exciting','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ad/92/ca/ad92ca90-90f5-eb46-7a56-e7b6b88584f7/25UMGIM37394.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c3/3a/44/c33a44ef-2b2f-3f03-02c9-dd2baa171e5e/mzaf_16705641561621535907.plus.aac.p.m4a',
      likes:4800 },

    // ── 2025~2026 히트곡 ──
    { id:'m17', youtubeId:'jWQx2f-CErU', title:'Whiplash', artist:'aespa',
      tags:['time','time-afternoon','mood','mood-exciting','mood-workout','mood-party','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1a/26/5d/1a265da7-ff45-8df0-ee94-7b79becfc7d9/888735949562.png/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/91/84/e5/9184e5d0-54c8-eccc-e62c-e3175a88b396/mzaf_13467227653896090925.plus.aac.p.m4a',
      likes:8900 },

    { id:'m18', youtubeId:'phuiiNCxRMg', title:'Supernova', artist:'aespa',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/7e/e0/507ee09f-ccfd-1e3c-af90-ca5e92b1221b/00888735949869_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f6/cc/58/f6cc5863-c60a-caac-e7f8-bd66b414a917/mzaf_8631809138360097160.plus.aac.p.m4a',
      likes:7800 },

    { id:'m19', youtubeId:'UCmgGZbfjmk', title:'Lucky Girl Syndrome', artist:'ILLIT',
      tags:['time','time-morning','mood','mood-exciting','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/b7/4e/22b74e6f-8297-bcef-7a97-042fd80fb10e/mzaf_10835128423678862503.plus.aac.p.m4a',
      likes:7100 },

    { id:'m20', youtubeId:'TEKyEQL-S8o', title:'Magnetic', artist:'ILLIT',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/7e/67/e87e6795-4ada-2f65-d562-1fd2a3eddfdf/mzaf_11263458879279601822.plus.aac.p.m4a',
      likes:9200 },

    { id:'m21', youtubeId:'GAy1NSzjxYY', title:'Easy', artist:'LE SSERAFIM',
      tags:['time','time-morning','mood','mood-exciting','mood-workout','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/19/f6/98/19f6985f-4633-0de9-6529-22e9c84e31be/mzaf_2983769807683393748.plus.aac.p.m4a',
      likes:7600 },

    { id:'m22', youtubeId:'n6B5gQXlB-0', title:'CRAZY', artist:'LE SSERAFIM',
      tags:['time','time-afternoon','mood','mood-exciting','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a6/61/15/a66115bc-4880-5088-a391-e53aece2b5d1/198704128295_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3d/be/fb/3dbefb3f-0e8c-2388-0aa4-8a77f97b5c40/mzaf_13400131403304487747.plus.aac.p.m4a',
      likes:6900 },

    { id:'m23', youtubeId:'Q3K0TOvTOno', title:'How Sweet', artist:'NewJeans',
      tags:['time','time-lunch','mood','mood-exciting','mood-relax','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/68/ca/bf68ca64-4acd-543f-bc78-455f11f06105/196922889738_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4d/f8/ec/4df8ec06-579b-0b92-1c4d-d8714cc5d1bc/mzaf_8361635933595309894.plus.aac.p.m4a',
      likes:7400 },

    { id:'m24', youtubeId:'ft70sAYrFyY', title:'Bubble Gum', artist:'NewJeans',
      tags:['time','time-afternoon','mood','mood-exciting','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/68/ca/bf68ca64-4acd-543f-bc78-455f11f06105/196922889738_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/94/d6/aa/94d6aab6-6654-5aca-dbf8-9874b7975bcd/mzaf_16231939766265640228.plus.aac.p.m4a',
      likes:6700 },

    { id:'m25', youtubeId:'ZncbtRo7RXs', title:'Supernatural', artist:'NewJeans',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ab/ce/d6/abced6f6-2b90-c230-eb4b-e146734a3a22/196922907821_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/41/ce/f9/41cef96a-6b48-2ddd-72a8-f479e7a1c752/mzaf_5570335600994446876.plus.aac.p.m4a',
      likes:6200 },

    { id:'m26', youtubeId:'ekr2nIex040', title:'APT.', artist:'ROSÉ & Bruno Mars',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d8/3c/e4/d83ce45f-3d8c-ba71-aaec-a98e8eeabe7d/075679628138_cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/95/79/f5/9579f50e-ac47-1e43-acab-d422cbe17a21/mzaf_12002777810095615569.plus.aac.p.m4a',
      likes:12000 },

    { id:'m27', youtubeId:'bB3-CUMERIU', title:'Mantra', artist:'JENNIE',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/48/12/ac/4812acbe-515a-6c85-3dfe-5bcc7abb5f68/cover_KM0020451_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/92/cf/9e/92cf9ea9-dca8-6f4b-ae60-474f5207c233/mzaf_2778188034025649064.plus.aac.p.m4a',
      likes:9500 },

    { id:'m28', youtubeId:'PGLx4V680J8', title:'Accendio', artist:'IVE',
      tags:['time','time-afternoon','mood','mood-exciting','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/97/18/44/97184494-ff70-dc93-3e38-02418a8a1e4c/cover_KM0019762_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3d/2c/97/3d2c97fb-ad12-b924-563b-810bb9a5a5a7/mzaf_13808354928403779528.plus.aac.p.m4a',
      likes:7200 },

    { id:'m29', youtubeId:'6ZUIwj3FgUY', title:'I AM', artist:'IVE',
      tags:['time','time-morning','mood','mood-exciting','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/fe/2f/49/fe2f497c-2b68-b67d-2199-67a3b8169e36/cover_KM0017019_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3d/57/20/3d5720b3-f6b4-a2fd-8d8f-96515cda91a3/mzaf_17422220011601403216.plus.aac.p.m4a',
      likes:6800 },

    { id:'m30', youtubeId:'xfqBQ2XhBCg', title:'SPOT! (feat. JENNIE)', artist:'ZICO',
      tags:['time','time-lunch','mood','mood-exciting','mood-party','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2e/2c/9c/2e2c9cb1-7352-867a-013c-9c885a9f7f4e/196922944741_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6e/c5/04/6ec5043a-f032-9803-f6c2-55956d0da9f9/mzaf_7311793964113917388.plus.aac.p.m4a',
      likes:9100 },

    { id:'m31', youtubeId:'ThI0pBAbFnk', title:'MAESTRO', artist:'SEVENTEEN',
      tags:['time','time-morning','mood','mood-exciting','mood-workout','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/69/16/f0691679-835f-8b9b-5baa-292b7e49423f/196922894992_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/97/6b/93/976b9343-c4b8-b5e0-83da-ee6ff942bf68/mzaf_2445087179169396572.plus.aac.p.m4a',
      likes:7000 },

    { id:'m32', youtubeId:'JpEwFycikr0', title:'LOVE, MONEY, FAME', artist:'SEVENTEEN',
      tags:['time','time-afternoon','mood','mood-exciting','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9a/30/ec/9a30ec28-9484-eaa3-5c5d-3aa7039ce0c1/198704184437_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a0/db/69/a0db69f7-a4ad-9752-f1fb-1fcc0e1d2e0f/mzaf_7189857230564623062.plus.aac.p.m4a',
      likes:6400 },

    { id:'m33', youtubeId:'6f3RzjXPQwA', title:'Super Lady', artist:'(G)I-DLE',
      tags:['time','time-morning','mood','mood-exciting','mood-workout','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/96/da/6d/96da6de4-8824-f449-7a7a-243aaa9f3a75/cover_KM0019415_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c8/d1/22/c8d122a1-5a1f-d156-4755-5c001f1ceaa1/mzaf_16459719413900633346.plus.aac.p.m4a',
      likes:6100 },

    { id:'m34', youtubeId:'Sz_wWzgh-vQ', title:'Strategy', artist:'TWICE feat. Megan Thee Stallion',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/e9/bf/a1e9bf9b-415b-0c83-fe87-e34e99025e44/TW-M14-Strategy-OnlineCover_1030.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cf/26/51/cf265110-5a90-9325-e395-f63423c93cf9/mzaf_1323161165329313652.plus.aac.p.m4a',
      likes:7800 },

    { id:'m35', youtubeId:'IajeQM00yfE', title:'Sticky', artist:'KISS OF LIFE',
      tags:['time','time-afternoon','mood','mood-exciting','mood-relax','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/00/c7/9b00c7e0-2e78-af06-bcfe-89d7a00e5a6d/cover_KM0019987_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/46/18/9f/46189f37-d2a0-d9f9-163a-5770c8677ad6/mzaf_6146227575934427595.plus.aac.p.m4a',
      likes:5900 },

    { id:'m36', youtubeId:'JsOOis4bBFg', title:'S-Class', artist:'Stray Kids',
      tags:['time','time-afternoon','mood','mood-exciting','mood-workout','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/96/b8/45/96b84544-f6e1-2702-f2d5-d5bda08f354e/SKZ_5_STAR_COVER.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/27/bb/3e/27bb3e95-242e-c9cf-6441-0e7d65168466/mzaf_6643100394843982473.plus.aac.p.m4a',
      likes:7300 },

    { id:'m37', youtubeId:'gQlMMD8auMs', title:'Pink Venom', artist:'BLACKPINK',
      tags:['time','time-afternoon','mood','mood-exciting','mood-workout','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/06/46/30/06463067-ade6-cc78-7a1f-bd4547a347be/BP_DigitalCover_F_4000px.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/62/f6/ff62f61a-477c-b4e2-37bf-b89efe368eec/mzaf_17717070560635734968.plus.aac.p.m4a',
      likes:10500 },

    { id:'m38', youtubeId:'hbcGx4MGUMg', title:'Rockstar', artist:'LISA',
      tags:['time','time-morning','mood','mood-exciting','mood-workout','mood-party','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/e9/bf/a1e9bf9b-415b-0c83-fe87-e34e99025e44/TW-M14-Strategy-OnlineCover_1030.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cf/26/51/cf265110-5a90-9325-e395-f63423c93cf9/mzaf_1323161165329313652.plus.aac.p.m4a',
      likes:8400 },

    { id:'m39', youtubeId:'ax1csKKQnns', title:'Love Wins All', artist:'IU',
      tags:['time','time-dawn','mood','mood-sad','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e3/56/1e/e3561eb5-de12-790d-569b-53fa22e6b491/cover_KM0019422_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/94/79/f5/9479f56a-ac54-6449-3603-0645090bb3c1/mzaf_7391528050042328078.plus.aac.p.m4a',
      likes:8700 },

    { id:'m40', youtubeId:'0-q1KafFCLU', title:'Celebrity', artist:'IU',
      tags:['time','time-morning','mood','mood-exciting','mood-relax','my-pick'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/52/a1/28/52a128c5-dcb8-ab00-83da-52b2e86218ff/LILAC_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/fa/f4/c8/faf4c8a9-8d78-ca2c-9ae5-b20c04c93ece/mzaf_5011060649397736738.plus.aac.p.m4a',
      likes:7200 },

    { id:'m41', youtubeId:'11cta61wi0g', title:'Hype Boy', artist:'NewJeans',
      tags:['time','time-morning','mood','mood-exciting','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4e/64/34/4e64344b-3ac6-c503-2c41-257a15401416/192641873096_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/85/f3/08/85f30899-e93c-35e2-4742-df57fc2d3552/mzaf_14134842621180071043.plus.aac.p.m4a',
      likes:6500 },

    { id:'m42', youtubeId:'Km71Rr9K-Bw', title:'Ditto', artist:'NewJeans',
      tags:['time','time-dawn','mood','mood-relax','mood-sad'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/26/16/9a/26169a2a-8fe3-6a4e-fdb6-17289bfeb3a6/196589610058.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/33/5b/d0/335bd0f3-5a9d-0de2-2e3c-5c0a3ccd5a5e/mzaf_7609618406316978038.plus.aac.p.m4a',
      likes:5800 },

    { id:'m43', youtubeId:'Jh4QFaPmdss', title:'TOMBOY', artist:'(G)I-DLE',
      tags:['time','time-morning','mood','mood-exciting','mood-workout','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/2d/5c/cf/2d5ccf75-c87b-0ab6-7c7e-91b4f1f0e53c/196589195814.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/80/0e/65/800e65dc-29a0-0e98-d7cc-39c77da0e2cf/mzaf_4069499714734793399.plus.aac.p.m4a',
      likes:5400 },

    { id:'m44', youtubeId:'pyf8cbqyfPs', title:'Antifragile', artist:'LE SSERAFIM',
      tags:['time','time-morning','mood','mood-exciting','mood-workout'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/15/11/69/15116954-7a50-48d0-c2db-bfe0c5a2a23a/196589451255.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/46/fe/9a/46fe9a78-a43b-a62d-f2da-b04d1e2a3fa7/mzaf_5481869948521609474.plus.aac.p.m4a',
      likes:6200 },

    { id:'m45', youtubeId:'Y8JFxS1HlDo', title:'Love Dive', artist:'IVE',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/a9/7e/f5/a97ef54e-c803-20bd-5c65-f4cd58f04870/196589308474.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/3b/40/1e/3b401e59-5fc8-7e32-0fd8-8b0a59aed7ff/mzaf_1374040399455024207.plus.aac.p.m4a',
      likes:5600 },

    { id:'m46', youtubeId:'d1vHiteACCY', title:'XO (Only If You Say Yes)', artist:'ENHYPEN',
      tags:['time','time-morning','mood','mood-exciting','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5f/c8/8c/5fc88cb7-faf5-483a-ea42-ebf112c5f3d7/198704187797_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/48/85/00/488500f0-bf48-9ca1-cf62-176c3b3a16ec/mzaf_7782046037355559306.plus.aac.p.m4a',
      likes:5100 },

    { id:'m47', youtubeId:'AbZH7XWDW_k', title:'INVU', artist:'TAEYEON',
      tags:['time','time-dawn','mood','mood-sad','mood-relax'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/31/57/83/31578320-668c-39ac-9b69-20beba684835/03_INVU.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/32/f4/32/32f4320b-9c80-1144-4a73-99768659e2bc/mzaf_18432216400216579717.plus.aac.p.m4a',
      likes:5700 },

    { id:'m48', youtubeId:'uR8Mrt1IpXg', title:'Psycho', artist:'Red Velvet',
      tags:['time','time-dawn','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/92/5d/da/925ddaf9-1108-ddc9-ce9c-34247d6ffce4/D-Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0c/f9/17/0cf91732-c7e1-6266-3c90-c43bc49254f5/mzaf_16512604588612495685.plus.aac.p.m4a',
      likes:7900 },

    { id:'m49', youtubeId:'UuV2BmJ1p_I', title:'아무노래 (Any Song)', artist:'ZICO',
      tags:['time','time-morning','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/14/1e/87/141e87bd-a541-e26a-bc74-c586d3e68d75/ZICO_cover_4000px.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a0/ae/6c/a0ae6c6f-cfb0-1af4-8afa-3efc4f23bdb4/mzaf_3852645139889131270.plus.aac.p.m4a',
      likes:6800 },

    { id:'m50', youtubeId:'7HDeem-JaSY', title:'Queencard', artist:'(G)I-DLE',
      tags:['time','time-afternoon','mood','mood-exciting','mood-party'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e0/c3/4f/e0c34f94-c7f5-e77b-7e10-a79f34e56ef4/198584872090.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/aa/fa/ab/aafaab24-e3e1-3c44-e83e-8f7a9dd7e9b5/mzaf_8867690073219869782.plus.aac.p.m4a',
      likes:5300 },

    // ── 봄 카테고리 세분화 30곡 추가 ──
    { id:'m51', youtubeId:'tXV7dfvSefo', title:'벚꽃 엔딩', artist:'버스커버스커',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/43/d8/6f/43d86fe5-632a-8226-be7c-7b5dee99a461/08809309174588_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/51/29/f4/5129f4ff-6ea4-a00a-a11b-c911713d9d70/mzaf_10819770660885468929.plus.aac.p.m4a',
      likes:4500 },

    { id:'m52', youtubeId:'RYr96YYEaZY', title:'Electric Love', artist:'BØRNS',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/07/37/8e/07378ef3-7950-ba76-4280-9acb0e5d032a/15UMGIM42534.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/19/8e/bd/198ebd2a-f7b5-b82c-9db2-cadbfe2f9240/mzaf_9391082379687958798.plus.aac.p.m4a',
      likes:3800 },

    { id:'m53', youtubeId:'bOaN2Av_NSw', title:'즐거운 인생', artist:'이광조',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/bd/e6/15/bde615b7-a2d9-a1d3-1870-f77956b5a8d2/8809887734860.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4b/8d/11/4b8d119f-57a1-a8c5-d08a-ade1a91e8da1/mzaf_10738129680037485617.plus.aac.p.m4a',
      likes:2100 },

    { id:'m54', youtubeId:'A7tOh8iGOz4', title:'Work, Shit, Sleep', artist:'지소쿠리클럽',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/a5/b3/1aa5b35f-cf08-dd09-3659-2722d97cc1fd/887928023997.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/35/55/fa/3555fa50-3c9b-686a-d166-10cdaaba3bb4/mzaf_4683403100742541411.plus.aac.p.m4a',
      likes:2900 },

    { id:'m55', youtubeId:'HFD0B6hOM34', title:'민들레 (full version)', artist:'우효',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/cf/45/2e/cf452eef-6d8c-245f-cb6d-a728dcd97a39/191953265056.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/c8/c2/72/c8c272c1-afa6-9dbb-6fab-d54b5424e418/mzaf_10659756529202667258.plus.aac.p.m4a',
      likes:5100 },

    { id:'m56', youtubeId:'KsznX5j2oQ0', title:'난춘', artist:'새소년',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/9d/83/29/9d832953-ab16-06cc-d0e1-3adf8f5f9e11/SESONEON_NANCHUN_3000.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/e1/b6/6b/e1b66b64-a406-4db3-2920-3c78adf65bf2/mzaf_2513733843274993778.plus.aac.p.m4a',
      likes:4800 },

    { id:'m57', youtubeId:'7P1G7CJpBX4', title:'Love Affair', artist:'UMI',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7f/e1/07/7fe10724-4864-19c0-1158-272f4169bc1d/886448923077.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b2/2d/4f/b22d4fa1-f22c-b238-5a7a-ec5eed5b4a46/mzaf_2866595405208276079.plus.aac.p.m4a',
      likes:3600 },

    { id:'m58', youtubeId:'J36z7AnhvOM', title:"Can't Take My Eyes Off You", artist:'Frankie Valli',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a0/b6/98/a0b6983b-3e5b-0a42-3d04-308425815922/s06.tapekocb.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/d4/99/d9/d499d93b-e65a-b192-4646-19b820594db6/mzaf_6962185864508552977.plus.aac.p.m4a',
      likes:6200 },

    { id:'m59', youtubeId:'sgNkCrAhTGc', title:'Flower', artist:'Johnny Stimson',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/67/af/56/67af56ea-2555-4d8c-6dd9-7c4bed73b3db/190295157111.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/1d/3c/a7/1d3ca7e3-47e7-815d-d279-d504b8db2b69/mzaf_3748429160361352228.plus.aac.p.m4a',
      likes:4100 },

    { id:'m60', youtubeId:'gn2vr-BO8Dc', title:'Why You Look Sad?', artist:'diverseddie',
      tags:['season','season-spring'],
      imgUrl:'https://cdn-images.dzcdn.net/images/cover/00d0dda61ac99960cbde4abb1fe8b9d8/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/2/e/7/0/2e713a489648c55e784cbf40edac134d.mp3',
      likes:4100 },

    { id:'m61', youtubeId:'0XbHhKpDpuI', title:'챠우챠우-아무리 애를 쓰고 막아 보려 해도 너의 목소리가 들려', artist:'델리스파이스',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/04/62/a8/0462a83a-7fc6-1842-d83c-469024f2466e/cover_KM0017058_1.png/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/f2/45/d0/f245d029-ad1a-ab19-7910-48f375447fae/mzaf_11767336370340933418.plus.aac.p.m4a',
      likes:6500 },

    { id:'m62', youtubeId:'lRVhaR1rWTc', title:'I Love You So', artist:'Delorians',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/86/03/d4/8603d463-6735-6ca6-f134-4708ef49f338/196699731957_cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/f/f/d/0/ffda73d893581327b467b2c2015aef64.mp3',
      likes:3300 },

    { id:'m63', youtubeId:'smVvQVCtka4', title:'봄바람 (feat. 나얼)', artist:'이문세',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/28/01/59/2801593e-1892-e5ab-640f-04134f5e4771/cover-_15.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5d/2f/41/5d2f41a1-b85f-6a47-9fff-be8af9febd2d/mzaf_9528556356713605532.plus.aac.p.m4a',
      likes:4300 },

    { id:'m64', youtubeId:'f5wCZ0-3Eos', title:'뜨거운 여름밤은 가고 남은 건 볼품없지만', artist:'잔나비',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/68/59/cd/6859cdcb-d7b3-566b-033f-547b44733bae/cover_-_SBS_K_Part.2.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d1/31/2f/d1312f1a-6b2d-6159-3e07-39fc57ab4890/mzaf_6244284241559156777.plus.aac.p.m4a',
      likes:7200 },

    { id:'m65', youtubeId:'EHTehfqKczQ', title:'Do Your Thing, Babe!', artist:'Michael Medrano & Funk Leblanc',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a8/21/f9/a821f97a-2f4d-8a79-f8e0-9bc269376e45/742623.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/f1/4d/cef14d93-600f-97ae-2706-952617cc8a95/mzaf_9710388108796398130.plus.aac.p.m4a',
      likes:2500 },

    { id:'m66', youtubeId:'JXF238w3wiE', title:'가죽자켓', artist:'혁오',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/20/de/43/20de43fe-733e-3734-cab9-7bd787411260/Cover_HYUKOH_23.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/df/35/23/df35234f-a0f2-fb31-7522-98b000f64dc6/mzaf_5970238462419888068.plus.aac.p.m4a',
      likes:4600 },

    { id:'m67', youtubeId:'h72trGgqh4w', title:'TOMBOY', artist:'혁오',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/20/de/43/20de43fe-733e-3734-cab9-7bd787411260/Cover_HYUKOH_23.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ad/29/37/ad29372c-c958-aa39-6880-e0a6a0ef6fe8/mzaf_13418271251705317271.plus.aac.p.m4a',
      likes:8100 },

    { id:'m68', youtubeId:'GIa80KLuDwc', title:'위잉위잉', artist:'혁오',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/21/d2/d3/21d2d3e3-ea98-140a-ef2d-33beeb06889f/dj.hbgytaml.png/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/66/a9/99/66a99930-927f-66bb-b61a-1fd69c7bf1a5/mzaf_17475642276779808719.plus.aac.p.m4a',
      likes:9300 },

    { id:'m69', youtubeId:'kOCkne-Bku4', title:'Paris in the Rain', artist:'Lauv',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5c/3d/e5/5c3de510-1123-0da6-9531-318d9597159c/5056167107347_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0e/c1/fd/0ec1fd20-0f65-e3eb-4134-f8133e74b1c9/mzaf_13950251868834939865.plus.aac.p.m4a',
      likes:8900 },

    { id:'m70', youtubeId:'a0OHkWX7B-E', title:'Every Summertime', artist:'NIKI',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a5/97/a2/a597a212-bcc5-3db5-e020-fad26aa6217d/21UMGIM77452.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c9/2d/dd/c92ddd90-3456-16fa-63bb-a4b0eb30b206/mzaf_12810469011616895532.plus.aac.p.m4a',
      likes:7400 },

    { id:'m71', youtubeId:'RSXiNSiiCsg', title:'Falling for U', artist:'Peachy! & mxmtoon',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/31/21/37/312137fd-9147-b2e6-bc1e-b0d440a4e44d/191924154549_cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/0b/58/7b/0b587b77-c455-450e-08f9-21b71caf62f4/mzaf_5492776330750031309.plus.aac.p.m4a',
      likes:6500 },

    { id:'m72', youtubeId:'NfPbQXGxSqE', title:'Sunflower (Live)', artist:'Rex Orange County',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/d5/97/ef/d597ef27-8b90-4df0-c10e-b1966c79f96c/886448774730.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/01/3c/78/013c7880-1054-9f3c-60f3-5360ba6c1878/mzaf_16968715549952035791.plus.aac.p.m4a',
      likes:7100 },

    { id:'m73', youtubeId:'WyWoW7L2yGM', title:'Beautiful', artist:'Crush',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/55/92/c4/5592c4a2-fe72-2302-0edb-0133f4548abb/8809534461279_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/41/e2/d1/41e2d146-6b36-94b7-9fab-527adc117622/mzaf_15100695928980147311.plus.aac.p.m4a',
      likes:8500 },

    { id:'m74', youtubeId:'dkpigAOw54o', title:'Lavender (feat. Sonny Zero)', artist:'dep.art',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8f/76/54/8f765480-77f4-0651-4cc7-764327476452/5021732553669.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4a/99/d3/4a99d329-3566-36b0-4f20-dc84b729ecdd/mzaf_2199853548343036704.plus.aac.p.m4a',
      likes:3700 },

    { id:'m75', youtubeId:'9U8uA702xrE', title:'우주를 줄게', artist:'볼빨간사춘기',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/7b/af/8e/7baf8ec9-e0b5-726a-e763-61bcdb3f7371/jacket-585591.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/9d/79/02/9d790212-7f41-df5b-bd77-f93268a66cf8/mzaf_13528148262790830846.plus.aac.p.m4a',
      likes:9200 },

    { id:'m76', youtubeId:'a-T8aVasQdY', title:'YACHT (feat. Sik-K)', artist:'박재범',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/29/33/a2/2933a292-860f-0fdb-c78a-5929a9309749/8809380636012_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/a0/54/a2/a054a20c-9e7c-4e5a-fdf2-44c4f3829ca1/mzaf_2033986053672730068.plus.aac.p.m4a',
      likes:6400 },

    { id:'m77', youtubeId:'Q-UZygeboOc', title:'peach eyes', artist:'wave to earth',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/71/b6/82/71b6820b-97a2-9968-c5a8-b659103030b1/5054197659843.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7b/82/a5/7b82a5a7-9674-1785-27ab-758b3295ca6b/mzaf_11805017291979445299.plus.aac.p.m4a',
      likes:5800 },

    { id:'m78', youtubeId:'CnVVjLOGVoY', title:'seasons', artist:'wave to earth',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/c5/61/fac561dc-8db4-b2e9-d3db-6e246da72bfa/5054197890017.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/0d/db/460ddbcc-1719-f42d-f446-fbcb08822db4/mzaf_15444859185091026401.plus.aac.p.m4a',
      likes:7400 },

    { id:'m79', youtubeId:'8HnLRrQ3RS4', title:'Lover Boy', artist:'Phum Viphurit',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e3/35/66/e335669b-7018-206a-3f96-739274d322f2/cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/12/76/62/1276629a-2b07-cfd4-97ad-8e8414050bfb/mzaf_4348425239984859892.plus.aac.p.m4a',
      likes:6900 },

    { id:'m80', youtubeId:'SbrK4ZF7HNE', title:'daisy.', artist:'wave to earth',
      tags:['season','season-spring'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0e/ea/5d/0eea5dbc-70d7-0dbc-cfd3-1fda93bc99aa/5054197888281.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/3b/f1/e53bf13b-683c-5b45-c850-2bb75ecf45c6/mzaf_11887572475505464862.plus.aac.p.m4a',
      likes:6100 },

    { id:'m81', youtubeId:'NzdzvnpekTc', title:'Sunburn', artist:'almost monday',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/89/67/8d/89678d2e-504f-da68-bf7a-76721345b9e6/24UMGIM52967.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/1/e/6/0/1e6df2b7297e3dbec6d91734f695a626.mp3?hdnea=exp=1780489178~acl=/api/1/1/1/e/6/0/1e6df2b7297e3dbec6d91734f695a626.mp3*~data=user_id=0,application_id=42~hmac=11db53c9ab737b970f61b2cb79bfc8df3cc150edbd200c79c48ae5745a08d715',
      likes:9872 },

    { id:'m82', youtubeId:'eVli-tstM5E', title:'Espresso', artist:'Sabrina Carpenter',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/e8/7b/57e87ba0-5057-9bb9-c247-ce7dbe426e89/24UMGIM55213.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/1/7/a/0/17a21c40ce4af3ac9514aac756403188.mp3?hdnea=exp=1780489181~acl=/api/1/1/1/7/a/0/17a21c40ce4af3ac9514aac756403188.mp3*~data=user_id=0,application_id=42~hmac=7372835f2a9d62f3bb6b902eba4d56efb5ce72589319f9b8ff77e4ef7c6c42e5',
      likes:7346 },

    { id:'m83', youtubeId:'AvCpJ-AKkco', title:'수영해', artist:'유라',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/8a/e4/b4/8ae4b438-e4d0-f26d-2893-30f19953dce0/191953265285.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/6/7/6/0/67694d87e8a92f7173005d483c497b53.mp3?hdnea=exp=1780489184~acl=/api/1/1/6/7/6/0/67694d87e8a92f7173005d483c497b53.mp3*~data=user_id=0,application_id=42~hmac=df293610024e6a3730f38554e6f4013e40611155f43c004d1fc2ec712f404ad0',
      likes:3237 },

    { id:'m84', youtubeId:'2v18oySsS58', title:'Can\'t Slow Down', artist:'almost monday',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6e/6c/b4/6e6cb4a2-b840-94f0-5e3e-f49b90a33dac/24UM1IM30242.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/1/8/2/0/1822af702655a4a78715e6c4271afeea.mp3?hdnea=exp=1780489187~acl=/api/1/1/1/8/2/0/1822af702655a4a78715e6c4271afeea.mp3*~data=user_id=0,application_id=42~hmac=160067639fb873ee859a89f745282cffc713890620170942058aba9190d0ac71',
      likes:6671 },

    { id:'m85', youtubeId:'IajeQM00yfE', title:'Sticky', artist:'KISS OF LIFE',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/00/c7/9b00c7e0-2e78-af06-bcfe-89d7a00e5a6d/cover_KM0019987_1.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/5/b/a/0/5bad601874af5b939d552f707f31fc93.mp3?hdnea=exp=1780489190~acl=/api/1/1/5/b/a/0/5bad601874af5b939d552f707f31fc93.mp3*~data=user_id=0,application_id=42~hmac=7865265baa3073ec4b4a043029710b29169199e7a9921e565035d2c42e799972',
      likes:8758 },

    { id:'m86', youtubeId:'-CYezUeha1Q', title:'비행기', artist:'거북이',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/f3/eb/6a/f3eb6a81-7d06-4f07-e190-de1541bec66a/192994003195.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/3/2/5/0/325f938b959547da6eb77d13bae3d979.mp3?hdnea=exp=1780489193~acl=/api/1/1/3/2/5/0/325f938b959547da6eb77d13bae3d979.mp3*~data=user_id=0,application_id=42~hmac=7437c806111c6a71dc23e570a5c7afb054f72b8f6faa5e263a69f08dc153234d',
      likes:5054 },

    { id:'m87', youtubeId:'rTKqSmX9XhQ', title:'Klaxon', artist:'(G)I-DLE',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/4e/ff/ec4eff34-d69a-b1c7-df76-5511c14b7fd4/198704037542.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/a/d/f/0/adf44d99b0774faaf5c8bdc5b3816598.mp3?hdnea=exp=1780489196~acl=/api/1/1/a/d/f/0/adf44d99b0774faaf5c8bdc5b3816598.mp3*~data=user_id=0,application_id=42~hmac=c1dade80a305b9b7dba4eb993600b7e86f51d746cd54e9aa1c70d2391b70f041',
      likes:2500 },

    { id:'m88', youtubeId:'z-rftpZ7kCY', title:'Hot Summer', artist:'f(x)',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/16/53/05/165305c5-1b91-4fec-47cd-e8683c168115/asset.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/4/7/0/b47318279f48bbff4d237674adbd9f00.mp3?hdnea=exp=1780489200~acl=/api/1/1/b/4/7/0/b47318279f48bbff4d237674adbd9f00.mp3*~data=user_id=0,application_id=42~hmac=aad519c9c02ab34eb65c3c67e8ea7849eceff4a97751182d13a929fa35545dad',
      likes:2565 },

    { id:'m89', youtubeId:'0pWz9xztrHE', title:'한여름밤의 꿀', artist:'San E, 레이나',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music/v4/37/90/5d/37905d57-d39e-b0c2-b92c-450626161233/KM0002776-San_E_DS-0612.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/6/4/4/0/644ee99a4d303f0f579ced4ca6e6bac1.mp3?hdnea=exp=1780489203~acl=/api/1/1/6/4/4/0/644ee99a4d303f0f579ced4ca6e6bac1.mp3*~data=user_id=0,application_id=42~hmac=0d6dc12563bf59cb04c992f6b0bc6ac82e5d00c232672dc6cd625c522338fc4c',
      likes:8424 },

    { id:'m90', youtubeId:'vWaRiD5ym74', title:'Cake By The Ocean', artist:'DNCE',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/46/dd/0d/46dd0d29-7dbf-7e3a-0f76-1595e18c4b73/16UMGIM68265.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/8/9/4/0/894bb0470dd38238cb9f1f86d1320f94.mp3?hdnea=exp=1780489206~acl=/api/1/1/8/9/4/0/894bb0470dd38238cb9f1f86d1320f94.mp3*~data=user_id=0,application_id=42~hmac=c20f356cd0cf834346f999281f3d2912fcea7c9ac5299e19718cee76d7fcb812',
      likes:3353 },

    { id:'m91', youtubeId:'Jbch_x5132o', title:'Sunshine', artist:'OneRepublic',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/85/3a/99/853a99f5-f575-27b4-345b-c029512889fa/21UM1IM35756.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/c/6/0/0/c60a938cf021db771624f8349d55ff3e.mp3?hdnea=exp=1780489209~acl=/api/1/1/c/6/0/0/c60a938cf021db771624f8349d55ff3e.mp3*~data=user_id=0,application_id=42~hmac=ec56d6e648799b03e523a08312acbf3f337782705b3e4f761f91c90ba445a9a6',
      likes:3969 },

    { id:'m92', youtubeId:'vZi8ET9k11g', title:'Feel It', artist:'d4vd',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1c/4a/d2/1c4ad2bd-efc3-0084-980f-003c01e4cfcd/24UMGIM24769.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/0/4/f/0/04f72430903d4bafcafbd9d4ae336793.mp3?hdnea=exp=1780489212~acl=/api/1/1/0/4/f/0/04f72430903d4bafcafbd9d4ae336793.mp3*~data=user_id=0,application_id=42~hmac=535ed1b72d9d6544b2480cce697235d6d9d2892a1136e062c495353385e7b874',
      likes:1626 },

    { id:'m93', youtubeId:'5zjWC2Kj5jQ', title:'여기저기거기', artist:'범키',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/77/9d/d2/779dd2ad-7053-31ca-6187-225761d899fa/8809934290943_cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/2/2/0/922f1d4832c5034a66e8f3d07ecd4262.mp3?hdnea=exp=1780489215~acl=/api/1/1/9/2/2/0/922f1d4832c5034a66e8f3d07ecd4262.mp3*~data=user_id=0,application_id=42~hmac=8c029191a29812698981382a0ecf868b3f93e8d71117720914c0f07d582fa6fd',
      likes:5910 },

    { id:'m94', youtubeId:'ETZW2HxN66s', title:'1-800-hot-n-fun', artist:'LE SSERAFIM',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/38/95/ed/3895ed80-ba5b-7846-ce5b-b49805a818ef/198704101359_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d7/98/4a/d7984acc-ec3d-702a-b712-f24a492c380d/mzaf_8154997953251408819.plus.aac.p.m4a',
      likes:5061 },

    { id:'m95', youtubeId:'HW8CZ0JzN7k', title:'Surf Boy', artist:'혁오',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/20/de/43/20de43fe-733e-3734-cab9-7bd787411260/Cover_HYUKOH_23.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/0/9/3/0/093bd82c055e87b0e461581aa6dc9c4a.mp3?hdnea=exp=1780489224~acl=/api/1/1/0/9/3/0/093bd82c055e87b0e461581aa6dc9c4a.mp3*~data=user_id=0,application_id=42~hmac=975b7567f18e6736c0540c05dc14d1b6aa783f4fd45655486ef7a4b66d215207',
      likes:2673 },

    { id:'m96', youtubeId:'tiKFuzpX-NA', title:'Drowning', artist:'WOODZ',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/91/0d/07910df6-5ab5-0867-3be5-900cf9d11018/cover_KM0016894_1.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/c/e/0/0/ce0f7012aa328b0fab679db60f8f7230.mp3?hdnea=exp=1780489227~acl=/api/1/1/c/e/0/0/ce0f7012aa328b0fab679db60f8f7230.mp3*~data=user_id=0,application_id=42~hmac=d2184278107181f8edbbaadad7a34a3f9825b8e7b077bfa4c30f14a56e8861f2',
      likes:3668 },

    { id:'m97', youtubeId:'JC6budcACNE', title:'Stay This Way', artist:'프로미스나인',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/20/bc/71/20bc7113-c509-acc6-cbcd-efd597f3e7a0/192641872471_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/6b/ca/9d/6bca9d99-8dc0-2510-05f7-639d491f495c/mzaf_7476390487766941164.plus.aac.p.m4a',
      likes:6306 },

    { id:'m98', youtubeId:'gjyEcSim4js', title:'PADO', artist:'비비',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a2/99/55/a29955b5-6c13-ae70-dea6-878e8041886a/BIBI_PADO_COVER.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/5/b/9/0/5b986771a0b38d4fe8259472dce81f37.mp3?hdnea=exp=1780489235~acl=/api/1/1/5/b/9/0/5b986771a0b38d4fe8259472dce81f37.mp3*~data=user_id=0,application_id=42~hmac=5e544e3e54786962ed8fb31143f34ff44c060337c66905ec67a92cf3795d34c9',
      likes:9997 },

    { id:'m99', youtubeId:'NIPtyAKxlRs', title:'우산 (feat. 윤하)', artist:'에픽하이',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d3/70/0d/d3700dea-ad51-4863-afaf-9fe8bc016010/08809231381580_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/4/6/b/0/46bd7027f756e25f4797f0b3d1e64f1d.mp3?hdnea=exp=1780489238~acl=/api/1/1/4/6/b/0/46bd7027f756e25f4797f0b3d1e64f1d.mp3*~data=user_id=0,application_id=42~hmac=bd03a9332cdf07d7dad36f0b6690401c176cce64e56277bfd97d12878dde4d5b',
      likes:8691 },

    { id:'m100', youtubeId:'JNy_pVfs6yQ', title:'영원은 그렇듯', artist:'리도어',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/a1/4d/ec/a14dec1c-aacc-3c49-fa83-300f25f2cab0/8809764938435_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/e/b/0/beb671498403e627623fe91d86b71441.mp3?hdnea=exp=1780489241~acl=/api/1/1/b/e/b/0/beb671498403e627623fe91d86b71441.mp3*~data=user_id=0,application_id=42~hmac=67ce33fb72f26f18e9b76fd37ea3204c8966766d699313fb14520d528fedcc4d',
      likes:7274 },

    { id:'m101', youtubeId:'MKuoYVUYrsQ', title:'And July', artist:'헤이즈, DEAN',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/9e/ba/a69ebae6-e47c-ec13-c670-4f8a1ffa6584/8809484116656_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/0/b/0/0/0b0777760d21624f6abe2baee6cf6608.mp3?hdnea=exp=1780489244~acl=/api/1/1/0/b/0/0/0b0777760d21624f6abe2baee6cf6608.mp3*~data=user_id=0,application_id=42~hmac=de4907573551443c150faf8f24c34c54f91f1b6cfe693d2ffe0361eaf79f1f6d',
      likes:2960 },

    { id:'m102', youtubeId:'44NE7bVKAYc', title:'BAHAMA', artist:'aespa',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/cf/97/05/cf970525-a2fd-a7e3-2812-0f9c3f3d2c33/888735947551.png/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b1/d5/78/b1d578be-5265-7c06-629c-828ef1915fa0/mzaf_13353841743570015037.plus.aac.p.m4a',
      likes:2383 },

    { id:'m103', youtubeId:'HrCCo-tFRgY', title:'작전명 청-춘!', artist:'잔나비',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a9/d6/d4/a9d6d4e2-0f52-be99-abd0-9e5c5338f507/cover_-.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/9e/b8/be/9eb8bece-7192-140b-98d4-f3b3820c922e/mzaf_2531938115243485878.plus.aac.p.m4a',
      likes:9810 },

    { id:'m104', youtubeId:'PT4euYnkSx4', title:'3AM', artist:'HONNE',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/02/d0/0e/02d00e43-344d-9ad4-a605-24211d742dc1/825646503056.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/c/6/8/0/c684bacca28cb7617786a18b39d49f0b.mp3?hdnea=exp=1780489258~acl=/api/1/1/c/6/8/0/c684bacca28cb7617786a18b39d49f0b.mp3*~data=user_id=0,application_id=42~hmac=3a9527643a3f375af529215f06c94b545f338e5408a38a1c3635f9a89eb25698',
      likes:9733 },

    { id:'m105', youtubeId:'G5xSLbYMr-I', title:'Sunroof', artist:'Nicky Youre',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/16/eb/da/16ebdac2-ad46-2a3e-ed48-2e65b3d71768/196589353177.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/f/e/3/0/fe3e73fba8a9e47a3bb031b7f9993c03.mp3?hdnea=exp=1780489261~acl=/api/1/1/f/e/3/0/fe3e73fba8a9e47a3bb031b7f9993c03.mp3*~data=user_id=0,application_id=42~hmac=c9cd520803160f8ce1781dfd82b47c261b6741747e410d2cb771b1144b6a336b',
      likes:6312 },

    { id:'m106', youtubeId:'00uzprkOeJQ', title:'Summer Tights', artist:'DPR LIVE',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/58/53/11/585311b1-e98d-05f4-07a4-15db7914857a/dj.alyhvtwi.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/5/e/d/0/5ed4b34eaf6eea137f4fc04f1cd42fcc.mp3?hdnea=exp=1780489264~acl=/api/1/1/5/e/d/0/5ed4b34eaf6eea137f4fc04f1cd42fcc.mp3*~data=user_id=0,application_id=42~hmac=5b8e7950710d5d58a634ef853306415cdda5b904d0b244b68da08f005d71a8c6',
      likes:2306 },

    { id:'m107', youtubeId:'kRj4toENrnA', title:'Island', artist:'WINNER',
      tags:['season','season-summer'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0e/64/ad/0e64adff-7f0f-4c00-6b8a-c035375a9717/WINNER-OTF_DIGITAL_COVER_4000.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/f/9/0/0/f9096422ce31867057b059510c3a1dbd.mp3?hdnea=exp=1780489267~acl=/api/1/1/f/9/0/0/f9096422ce31867057b059510c3a1dbd.mp3*~data=user_id=0,application_id=42~hmac=03e5d45e7a9fcfe4dfbb40846b3bf8313fde8eac668207ae688a8056d8dd6766',
      likes:6532 },

    { id:'m108', youtubeId:'842_hv_HNrs', title:'Malibu 1992', artist:'COIN',
      tags:['season','season-summer'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/b6dcbe673c094aef93f834cfd1fa0665/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/8/9/0/98981b2804f48d27364d23bfb35990eb.mp3?hdnea=exp=1780489270~acl=/api/1/1/9/8/9/0/98981b2804f48d27364d23bfb35990eb.mp3*~data=user_id=0,application_id=42~hmac=036c9d2d3851bd175fb7462cc26c09550a708e25553114ff0641a5486bc9ada6',
      likes:5886 },

    { id:'m109', youtubeId:'5-rbSNzU_b8', title:'Sunsetz', artist:'Cigarettes After Sex',
      tags:['season','season-summer'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/2db20377876da16feb8ec9652e835a81/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/6/9/7/0/697b2adc2271af95c13106c0ff0e433e.mp3?hdnea=exp=1780489273~acl=/api/1/1/6/9/7/0/697b2adc2271af95c13106c0ff0e433e.mp3*~data=user_id=0,application_id=42~hmac=c7a918c90dcebb38524b665aebc9156c824a350991789f99f08cf1a23de49da4',
      likes:7041 },

    { id:'m110', youtubeId:'eimgRedLkkU', title:'Walking on a Dream', artist:'Empire of the Sun',
      tags:['season','season-summer'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/f8f1062a830d11fd831c1af7fbea4231/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/f/b/0/bfbfe7fb08c68f552c470b031fd4b162.mp3?hdnea=exp=1780489276~acl=/api/1/1/b/f/b/0/bfbfe7fb08c68f552c470b031fd4b162.mp3*~data=user_id=0,application_id=42~hmac=f7d687310d32ca95a5f8fa0c0c1203619daabecc533c9b0a1e0afb21273d0a84',
      likes:1717 },

    { id:'m111', youtubeId:'WDAPcnJJteY', title:'가을이 오면', artist:'이문세',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/c2/b6/e1/c2b6e151-0dd7-b6bc-a326-505878fe6915/135544.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/0/9/1/0/091ee50a9cde1fca69165673a9cabcbf.mp3?hdnea=exp=1780489279~acl=/api/1/1/0/9/1/0/091ee50a9cde1fca69165673a9cabcbf.mp3*~data=user_id=0,application_id=42~hmac=65f7c0c029df84b6763498cf481b890f4d8590ea4c7acaaaa4886aa151134c7f',
      likes:3845 },

    { id:'m112', youtubeId:'ROIvbbg8jMQ', title:'가을 밤에 든 생각', artist:'잔나비',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a9/d6/d4/a9d6d4e2-0f52-be99-abd0-9e5c5338f507/cover_-.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c6/87/04/c68704d2-660b-0eb0-a74a-2e75818c40f8/mzaf_3587013114541262927.plus.aac.p.m4a',
      likes:5529 },

    { id:'m113', youtubeId:'Gj9AmXSWNg8', title:'<3 Song', artist:'Delorians',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/80/91/b4/8091b436-0580-e510-92ba-ccfc4e3699b3/artwork.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/4/f/a/0/4fa6811e080847c4ca147fcf8b455540.mp3?hdnea=exp=1780489287~acl=/api/1/1/4/f/a/0/4fa6811e080847c4ca147fcf8b455540.mp3*~data=user_id=0,application_id=42~hmac=87d28e929f6049fef4f2c55d6f65605ae1f15e7bb0b922a4fca7d07d44f88f89',
      likes:3124 },

    { id:'m114', youtubeId:'NTpbbQUBbuo', title:'Too Sweet', artist:'Hozier',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/98/80/95/98809581-4a0e-68a6-04de-b72492e35939/196871908191.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/a/c/4/0/ac4097bdcb716e55282570ca08c09b58.mp3?hdnea=exp=1780489290~acl=/api/1/1/a/c/4/0/ac4097bdcb716e55282570ca08c09b58.mp3*~data=user_id=0,application_id=42~hmac=388590f129282566d2d8295306ec4177c3d77b020fddce9f8b19620b9a081e81',
      likes:5860 },

    { id:'m115', youtubeId:'SB4Jra4zR80', title:'Me & You', artist:'HONNE',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6c/52/79/6c527981-1e36-d2ce-6642-78ce76f8bbcd/820200049759.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/a/f/0/9af04916bd7f749c3fe1236505cf8fe6.mp3?hdnea=exp=1780489293~acl=/api/1/1/9/a/f/0/9af04916bd7f749c3fe1236505cf8fe6.mp3*~data=user_id=0,application_id=42~hmac=c3dd0ad57323abeae76d0c7775b9f4fedd5fad11e06aec4532c540da83e138c6',
      likes:7042 },

    { id:'m116', youtubeId:'PyrX8c1HGZw', title:'Trendsetter', artist:'Connor Price',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/26/27/eb/2627eb34-8bde-ccce-b83e-a1ff5f27f892/artwork.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/2/3/d/0/23d6150daf68bb5f3e61a4deef3e2953.mp3?hdnea=exp=1780489296~acl=/api/1/1/2/3/d/0/23d6150daf68bb5f3e61a4deef3e2953.mp3*~data=user_id=0,application_id=42~hmac=3af04d89f6b919d427b12fb4bbb268184923cba9c52758fbd263da0c44797deb',
      likes:9199 },

    { id:'m117', youtubeId:'JXPeynzlEdY', title:'Lay It Down (Remix)', artist:'Steelix',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/0b/e7/e7/0be7e708-42c4-b5a4-b25d-d1d529ebfc86/0603497968237.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/0/8/a/0/08a30ce00f39fc0f556d1f67e058457c.mp3?hdnea=exp=1780489299~acl=/api/1/1/0/8/a/0/08a30ce00f39fc0f556d1f67e058457c.mp3*~data=user_id=0,application_id=42~hmac=f56b56c2ee7d5196abb37355f5fe76f01f28339b6e3f5df86081c1576bfefcb7',
      likes:3302 },

    { id:'m118', youtubeId:'K0pohSE1ous', title:'November Rain', artist:'잔나비',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/1e/f8/9c/1ef89c01-51a3-4ad1-62a7-32ba9de6793b/cover-_November_Rain_NEW.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ef/bf/10/efbf10ee-539e-5892-6016-56a2dd8e11f2/mzaf_891302359580451226.plus.aac.p.m4a',
      likes:6548 },

    { id:'m119', youtubeId:'QAyI7POZllk', title:'Black Swan', artist:'GIST',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e2/e6/97/e2e69707-60ed-a11a-0485-4e6dfc1afe57/888272093995_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/3/b/d/0/3bdbcb61db2e975440320f0236153503.mp3?hdnea=exp=1780489307~acl=/api/1/1/3/b/d/0/3bdbcb61db2e975440320f0236153503.mp3*~data=user_id=0,application_id=42~hmac=eb8b3b52f710d34ac6715e80fe9a704cc8e60396eff97500427b296d28b4434f',
      likes:5543 },

    { id:'m120', youtubeId:'uzS3WG6__G4', title:'Pink + White', artist:'Frank Ocean',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/5/3/9/0/539d5ac2b897f16027d0aaf22d844f15.mp3?hdnea=exp=1780489310~acl=/api/1/1/5/3/9/0/539d5ac2b897f16027d0aaf22d844f15.mp3*~data=user_id=0,application_id=42~hmac=59b3ca06e464648205ba86a499ef97b98d5b4768d281e54b69b1cf891c5e8e93',
      likes:3437 },

    { id:'m121', youtubeId:'A0gP4id3Gxc', title:'서울 밤', artist:'어반자카파',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/5af62d4b6f0d2ad8ba42f986aab54352/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/a/2/2/0/a22bf37d9c4e7b946e72f1ecd667a06b.mp3?hdnea=exp=1780489313~acl=/api/1/1/a/2/2/0/a22bf37d9c4e7b946e72f1ecd667a06b.mp3*~data=user_id=0,application_id=42~hmac=6994b5560cc46527cb19aeb43581e9939984b38536ef2a2f1ab6046bc3bbf2b0',
      likes:8893 },

    { id:'m122', youtubeId:'1HfsK4rzr5s', title:'투게더!', artist:'잔나비',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fc/a9/b2/fca9b2d4-b1ed-92e8-2e5f-1838d77cbce7/cover-_NEW.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/6/3/c/0/63cce1aa3dda025070c7ce00e4e4a32d.mp3?hdnea=exp=1780489317~acl=/api/1/1/6/3/c/0/63cce1aa3dda025070c7ce00e4e4a32d.mp3*~data=user_id=0,application_id=42~hmac=f346f42fd5400b102e4c48af401ae26dad1fe0638f6e717a70b8e63cc6d2494f',
      likes:4594 },

    { id:'m123', youtubeId:'_-V6hB4W604', title:'Redbone', artist:'Childish Gambino',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/964acadabc2b6e286ce5e8e5add495a0/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/1/9/0/91921f2038858fa3f684647e89f702df.mp3?hdnea=exp=1780489319~acl=/api/1/1/9/1/9/0/91921f2038858fa3f684647e89f702df.mp3*~data=user_id=0,application_id=42~hmac=483141d351303e326c87ca5fb90d9d054e4143bcf2dc973958de0b7e9e7c5492',
      likes:5545 },

    { id:'m124', youtubeId:'ed0CcFcBBMI', title:'민수는 혼란스럽다', artist:'민수',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/21/c1/93/21c1930c-ef73-3779-8164-a371d5b2dc70/888272056020.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/c/d/4/0/cd4a29621a4ce617a31c3eb0993a62bd.mp3?hdnea=exp=1780489322~acl=/api/1/1/c/d/4/0/cd4a29621a4ce617a31c3eb0993a62bd.mp3*~data=user_id=0,application_id=42~hmac=729cbaa8701ad0b35be5acaee0fbe200d8a1b3ebe5e6a52ab4fdbc4aabfc507c',
      likes:2381 },

    { id:'m125', youtubeId:'_fMzDIIsWKA', title:'Preach', artist:'Saint Motel',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/fe5d95065c9f36fd580e318f10c6933f/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/e/c/0/9ec89dab81b0162e5eb7be5aa3f4ebe1.mp3?hdnea=exp=1780489325~acl=/api/1/1/9/e/c/0/9ec89dab81b0162e5eb7be5aa3f4ebe1.mp3*~data=user_id=0,application_id=42~hmac=dce6fee9ffa2b11e333b1bf977b7568033e21c2bee3fe27dbe5531211dc2f639',
      likes:4400 },

    { id:'m126', youtubeId:'IyVPyKrx0Xo', title:'My Type', artist:'Saint Motel',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f3/83/43/f38343e2-5750-c2c1-891f-18507bd559c3/825646264025.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e6/89/3f/e6893f71-14c1-b358-0a7d-145cb860fef2/mzaf_11178618377137448787.plus.aac.p.m4a',
      likes:1734 },

    { id:'m127', youtubeId:'HIgvP7B3Hg8', title:'Runaway Baby', artist:'Bruno Mars',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/8c9094acc358501a51c22b9f472a0e14/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/d/1/b/0/d1bf515ea82b8607c2933e8ae22f0205.mp3?hdnea=exp=1780489334~acl=/api/1/1/d/1/b/0/d1bf515ea82b8607c2933e8ae22f0205.mp3*~data=user_id=0,application_id=42~hmac=1291798c9c4769361a6b2e8509efa0b507a47bae753ac3f2158535e46e4417a6',
      likes:8506 },

    { id:'m128', youtubeId:'pKtKkDly0Kk', title:'Only Wanna Dance', artist:'almost monday',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/61c2486c02530720129a13a01e2b2c6e/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/3/7/0/b378b0e894fab0c36f500e3ff624880e.mp3?hdnea=exp=1780489336~acl=/api/1/1/b/3/7/0/b378b0e894fab0c36f500e3ff624880e.mp3*~data=user_id=0,application_id=42~hmac=c2edbf95fac3c32674b4cece45616ef402e4f75cd485899bf04e0c9b4c7473db',
      likes:4275 },

    { id:'m129', youtubeId:'yyDUC1LUXSU', title:'Blurred Lines', artist:'Robin Thicke',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/b1/b9/9fb1b976-bec0-1964-053d-001fed83a720/13UAAIM09929.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/8/3/2/0/8321a0914582b2e20e334bba1db130c7.mp3?hdnea=exp=1780489339~acl=/api/1/1/8/3/2/0/8321a0914582b2e20e334bba1db130c7.mp3*~data=user_id=0,application_id=42~hmac=353f69532188b2bdfb3efb89d0da7af6915776021eea5f8a6f37dd1ebaa8a561',
      likes:2416 },

    { id:'m130', youtubeId:'fLWuMf3ggHc', title:'Mouse', artist:'이고도',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ea/67/1d/ea671da0-bbe8-a939-e7c4-b3053723c488/LeeGoDo_Mouse_3000.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/3/0/f/0/30f70822cdc06c3cdf5acbbe3cfc5880.mp3?hdnea=exp=1780489342~acl=/api/1/1/3/0/f/0/30f70822cdc06c3cdf5acbbe3cfc5880.mp3*~data=user_id=0,application_id=42~hmac=b19a8c53a70c8a026b30a27e57ed868ff47c3a2b94a4813aec862b10f2eaa3f6',
      likes:8171 },

    { id:'m131', youtubeId:'0BdlKkvjEgA', title:'Good Days', artist:'SZA',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/8aafccd5fc82acdebc88372bd1bef371/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/7/1/1/0/711000e4b2510e58e2f9e5fc265be4ea.mp3?hdnea=exp=1780489345~acl=/api/1/1/7/1/1/0/711000e4b2510e58e2f9e5fc265be4ea.mp3*~data=user_id=0,application_id=42~hmac=f42f7c129592c74bbeb678f5ddce76b2342188724d111bd1627665347e74d6de',
      likes:6956 },

    { id:'m132', youtubeId:'qbEVGyRfS0I', title:'Ride', artist:'HYBS',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/862e9025f57f5699d90f000317298d72/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/9/e/0/99e38dba1a7e2143fcf546e6bfe82a37.mp3?hdnea=exp=1780489348~acl=/api/1/1/9/9/e/0/99e38dba1a7e2143fcf546e6bfe82a37.mp3*~data=user_id=0,application_id=42~hmac=c127ecd81aaefbf9ad2b27c7a1bde16725ba89d0227f5cdaa600646bf8f9a0e3',
      likes:9578 },

    { id:'m133', youtubeId:'xF-lR9JlRls', title:'Real Thing', artist:'THAMA',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/42/e7/8d/42e78dd1-12fd-f0c0-cc0e-15ee03288664/075679760913.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/a/0/f/0/a0fd319841dce21fca06ec1e858aeec6.mp3?hdnea=exp=1780489351~acl=/api/1/1/a/0/f/0/a0fd319841dce21fca06ec1e858aeec6.mp3*~data=user_id=0,application_id=42~hmac=40c272628b4b344047b06b93c2b65d85c08035d836b3d9be56298d91724df1df',
      likes:6905 },

    { id:'m134', youtubeId:'SL3KEvmAgoY', title:'조용히 완전히 영원히', artist:'너드커넥션',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d1/8a/05/d18a057b-fcd5-7df6-c846-fd6e71f5a8d2/82330555.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/f/f/c/0/ffcb439d5d08a82a6d17706a913d0f8c.mp3?hdnea=exp=1780489354~acl=/api/1/1/f/f/c/0/ffcb439d5d08a82a6d17706a913d0f8c.mp3*~data=user_id=0,application_id=42~hmac=a918ded382d18b278a114055db63bf1a5d3b304d8f8f243af2887bad0e4b6f5e',
      likes:8670 },

    { id:'m135', youtubeId:'vBy7FaapGRo', title:'Best Part', artist:'Daniel Caesar',
      tags:['season','season-fall'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/4dff56488d13d0b5e96d93d895c9624b/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/a/1/2/0/a122fc6c633aa6a2547c318bc3dcd4ef.mp3?hdnea=exp=1780489357~acl=/api/1/1/a/1/2/0/a122fc6c633aa6a2547c318bc3dcd4ef.mp3*~data=user_id=0,application_id=42~hmac=fe9e9be18a380f720fc286cd50e50848bd9d9ddea11736e37d128f29f9f159f3',
      likes:2051 },

    { id:'m136', youtubeId:'4MXruqqZb8Q', title:'Japanese Denim', artist:'Daniel Caesar',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b6/cd/1a/b6cd1a5b-83af-a1e2-0ad7-ea530fcf2522/859722261219.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/d/4/0/bd4530ea51281fe0896314910bb84e31.mp3?hdnea=exp=1780489360~acl=/api/1/1/b/d/4/0/bd4530ea51281fe0896314910bb84e31.mp3*~data=user_id=0,application_id=42~hmac=7c1084117d097b36cc77b281be2ccfbcad1f7dd7f4de33dc8b513265c01d073a',
      likes:6799 },

    { id:'m137', youtubeId:'AE005nZeF-A', title:'Ivy', artist:'Frank Ocean',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/d/9/c/0/d9c55abad83593e9c9d2389d428c8d9a.mp3?hdnea=exp=1780489363~acl=/api/1/1/d/9/c/0/d9c55abad83593e9c9d2389d428c8d9a.mp3*~data=user_id=0,application_id=42~hmac=c4d3de4d2b39ccedbaa4941d75c184ee82c0de8b601d59a9d2b0750e98aa220d',
      likes:9663 },

    { id:'m138', youtubeId:'opeETnB8m8w', title:'Cigarette Daydreams', artist:'Cage The Elephant',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/02/d2/e2/02d2e290-82c9-bcf4-73fa-4cd06f65f4b9/886444143073.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/2/1/c/0/21cc7edf9dc64bcca445fadd546aacc0.mp3?hdnea=exp=1780489366~acl=/api/1/1/2/1/c/0/21cc7edf9dc64bcca445fadd546aacc0.mp3*~data=user_id=0,application_id=42~hmac=cc02c013d50f56bd7a440c3fdbc19ab4e6f8f1a3b98b05ab13026ddbeeba6ed5',
      likes:8245 },

    { id:'m139', youtubeId:'btIQvYcLNoI', title:'Location Unknown', artist:'HONNE',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6c/52/79/6c527981-1e36-d2ce-6642-78ce76f8bbcd/820200049759.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/5/e/7/0/5e7a6c3ad17157bfcaa8bde96c461ea4.mp3?hdnea=exp=1780489369~acl=/api/1/1/5/e/7/0/5e7a6c3ad17157bfcaa8bde96c461ea4.mp3*~data=user_id=0,application_id=42~hmac=3b10380c855a5305d468320882f214bce1646dc89f2ccfd1ceadcf310b05cd2d',
      likes:3985 },

    { id:'m140', youtubeId:'gQc2vq53scU', title:'Plastic Plants', artist:'Mahalia',
      tags:['season','season-fall'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b4/02/b0/b402b07d-85b6-8850-4c9f-46fcd24572ff/190295222826.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b0/88/b1/b088b14d-f7e3-c631-a910-ecba8a52c765/mzaf_6903410670927462175.plus.aac.p.m4a',
      likes:8135 },

    { id:'m141', youtubeId:'CX5f0NcqlMs', title:'Warm On A Cold Night', artist:'HONNE',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/98/9c/3b/989c3bb9-bdd3-47dd-b18e-13a3459030d4/825646108718.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/01/2b/b4/012bb45d-69dc-8929-8efb-c03c5b51e758/mzaf_3661186428107194084.plus.aac.p.m4a',
      likes:5134 },

    { id:'m142', youtubeId:'E2vTXwQX1pE', title:'Good Together', artist:'HONNE',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/54/02/da/5402daa2-6346-980a-6681-894a1e92c958/190295924904.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/2/f/0/b2fe2763aaa3386144f12b829599724c.mp3?hdnea=exp=1780489383~acl=/api/1/1/b/2/f/0/b2fe2763aaa3386144f12b829599724c.mp3*~data=user_id=0,application_id=42~hmac=3486010c71e7f3b8af0bda1d6e691864b7d2d68ffaa8ca8c38a645c6e1909b5c',
      likes:9906 },

    { id:'m143', youtubeId:'UczEuR_8nSk', title:'Raye', artist:'John Splithoff',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/21/d8/7e/21d87e69-aeec-6514-d2cd-2d24cc767a1e/075597928440.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/8/9/0/b896ff127b8dc27149d9b98b17a1ba69.mp3?hdnea=exp=1780489386~acl=/api/1/1/b/8/9/0/b896ff127b8dc27149d9b98b17a1ba69.mp3*~data=user_id=0,application_id=42~hmac=7fcc89c0a473b8736ec877bda2c0f95f063dca303a02c0b17b6435560dce98b2',
      likes:2359 },

    { id:'m144', youtubeId:'HE1SvTy460I', title:'It Ain\'t Wrong Loving You', artist:'HONNE',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f2/f4/4f/f2f44faf-58f8-0808-f243-682dfebd6431/190295953188.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/b2/3d/a3/b23da39f-3565-3077-1a28-2aa53c8eb7dd/mzaf_11853934676813190590.plus.aac.ep.m4a',
      likes:5886 },

    { id:'m145', youtubeId:'sALaO1-cFxI', title:'싱숭생숭', artist:'다이나믹 듀오',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/91/b3/63/91b363f9-c165-f1be-e8e0-a6d30cec8961/KM0003067-_DS-1205.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/bc/8f/1b/bc8f1ba7-fc76-1429-ce53-2bcad9885b69/mzaf_11284123451221641856.plus.aac.p.m4a',
      likes:4662 },

    { id:'m146', youtubeId:'0ATMKNLZTTc', title:'눈이 오잖아', artist:'이무진',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/26/2d/da/262ddac9-329d-fb00-8e3f-1d6f2d3219e5/cover_KM0014407_1.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/23/a1/b7/23a1b7ca-6f7b-200e-e9e6-fbc77392c816/mzaf_3405118225473722429.plus.aac.p.m4a',
      likes:3911 },

    { id:'m147', youtubeId:'tnAxZipkuWw', title:'회전목마', artist:'sokodomo',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/11/04/d3110498-9e5f-9258-0d54-de651b1d5203/888272089974_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/4/3/0/b43898297e4f71ff19633fdd1f6bcb74.mp3?hdnea=exp=1780489406~acl=/api/1/1/b/4/3/0/b43898297e4f71ff19633fdd1f6bcb74.mp3*~data=user_id=0,application_id=42~hmac=40d6415a8d9658f6040f03bfe6fa7623cf95203ed6c595ebd8aea4123f964a12',
      likes:9596 },

    { id:'m148', youtubeId:'dIl7A4cSTxo', title:'By My Side', artist:'HONNE',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/f9/2a/88/f92a8813-59a6-0e4f-d9a9-d4fc5316bd9e/190295102043.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/8/b/8/0/8b8ba9d50afecfdef5251fc1bb951e55.mp3?hdnea=exp=1780489409~acl=/api/1/1/8/b/8/0/8b8ba9d50afecfdef5251fc1bb951e55.mp3*~data=user_id=0,application_id=42~hmac=400fdb6fa9127547262a07519443cfd65fa3384f1319c88a8d71b6a0d94a865a',
      likes:1957 },

    { id:'m149', youtubeId:'ygTZZpVkmKg', title:'After Hours', artist:'The Weeknd',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6f/bc/e6/6fbce6c4-c38c-72d8-4fd0-66cfff32f679/20UMGIM12176.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/7/a/5/0/7a57adf1f07af04ff457e0ce2c509d4a.mp3?hdnea=exp=1780489412~acl=/api/1/1/7/a/5/0/7a57adf1f07af04ff457e0ce2c509d4a.mp3*~data=user_id=0,application_id=42~hmac=b1eaea3bc8930e1a7bd377aefb26443fa87a636743cf49a10b37bead8ff14f51',
      likes:6230 },

    { id:'m150', youtubeId:'7YZ5a3pdY-M', title:'Mulholland Drive', artist:'Josef Lee',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/57/22/b6/5722b69f-798e-c0f0-b1dc-bddcc1f33564/190295490676.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5d/e1/86/5de1867c-26ea-ef3d-df2d-d639bac0d6e1/mzaf_15943978106840721381.plus.aac.ep.m4a',
      likes:9339 },

    { id:'m151', youtubeId:'u3RAU0T2RC4', title:'공드리', artist:'혁오',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/25/ae/83/25ae83a9-72a2-ed55-b2ef-9ac0927737cf/Untitled.png/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/8/6/9/0/86918d5e5c982beaddfcd8cb282d22cb.mp3?hdnea=exp=1780489420~acl=/api/1/1/8/6/9/0/86918d5e5c982beaddfcd8cb282d22cb.mp3*~data=user_id=0,application_id=42~hmac=02e0c24ca8b90b218354f50384157f6ba607ac864b3e1245e45ef782ac07a643',
      likes:4942 },

    { id:'m152', youtubeId:'ujCdcX6o3e0', title:'Can I Love?', artist:'Cosmic Boy',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3c/b9/66/3cb966fc-f06a-d1f7-ea98-bf3920fc54a0/5021732447449.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a8/08/73/a8087357-d2fd-f417-b3da-9532c5a26615/mzaf_16382646391285147897.plus.aac.p.m4a',
      likes:4683 },

    { id:'m153', youtubeId:'HkkhK99KyI0', title:'겨울을 걷는다', artist:'윤딴딴',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/dd/9e/98/dd9e98dc-240b-d8c6-ad36-bfffe5450fa4/191953034768.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/6/6/2/0/662ce20d80ac7221f69e0d7d6f7b9fba.mp3?hdnea=exp=1780489428~acl=/api/1/1/6/6/2/0/662ce20d80ac7221f69e0d7d6f7b9fba.mp3*~data=user_id=0,application_id=42~hmac=78798dad4e7a6780949173149ecd6f003f1d5c425fca36c5d66b40dbb060add5',
      likes:7631 },

    { id:'m154', youtubeId:'elj7ZunX7eU', title:'Slow Down', artist:'김하온',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/a2/0a/95/a20a952e-8f21-a07a-4395-a52e8a32434b/8809704410922_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/d/8/0/9d86fec910a0c5e04d491922ab64c6e2.mp3?hdnea=exp=1780489431~acl=/api/1/1/9/d/8/0/9d86fec910a0c5e04d491922ab64c6e2.mp3*~data=user_id=0,application_id=42~hmac=733c75031fed04cc5d3fbcb107bce2c9357158ba059025f2b0d86057fb8abef1',
      likes:5004 },

    { id:'m155', youtubeId:'4VaqA-5aQTM', title:'Late Night Talking', artist:'Harry Styles',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/e/2/b/0/e2b065b5086ac8ced8d6c10810dd130d.mp3?hdnea=exp=1780489434~acl=/api/1/1/e/2/b/0/e2b065b5086ac8ced8d6c10810dd130d.mp3*~data=user_id=0,application_id=42~hmac=bb8aba40a0af5d38e056c66cb81f2c72c60efcd0ffa752578445adea3c0d417b',
      likes:1974 },

    { id:'m156', youtubeId:'YiadNVhaGwk', title:'Run Rudolph Run', artist:'Chuck Berry',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3a/7a/1b/3a7a1ba9-cbbb-8c92-11c9-a29934045529/06UMGIM18712.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/e/9/7/0/e97b7c44e4bbe32b3ee183e58411d5b7.mp3?hdnea=exp=1780489437~acl=/api/1/1/e/9/7/0/e97b7c44e4bbe32b3ee183e58411d5b7.mp3*~data=user_id=0,application_id=42~hmac=b75c8ef52222905368f3f7f0fca7d9fd9dd7327241d6f700aaa18b6979e5ec7f',
      likes:2828 },

    { id:'m157', youtubeId:'aAkMkVFwAoo', title:'All I Want For Christmas Is You', artist:'Mariah Carey',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c6/b7/27/c6b727f7-3a32-6b43-cee2-05bb71daf1cf/dj.itfmdeif.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/3/3/a/0/33a49805b18ab6839be984c716925c97.mp3?hdnea=exp=1780489440~acl=/api/1/1/3/3/a/0/33a49805b18ab6839be984c716925c97.mp3*~data=user_id=0,application_id=42~hmac=8a7392896d7f049f0dd0b27c74ad9e29c42ccdd9674341490d6710db110a2989',
      likes:9229 },

    { id:'m158', youtubeId:'3ZT9_H4-hbM', title:'You Make It Feel Like Christmas', artist:'Gwen Stefani',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/a1/89/5d/a1895dd5-f61e-e14e-b7b2-c1c4aa434934/20UMGIM91349.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/d/1/4/0/d14b5747fc9c0549587e8ea1cd2477b7.mp3?hdnea=exp=1780489443~acl=/api/1/1/d/1/4/0/d14b5747fc9c0549587e8ea1cd2477b7.mp3*~data=user_id=0,application_id=42~hmac=2ef70258c466fbf2b7384c0b17f90185eff5ef10df1fe9c6c97f652a09e45bcb',
      likes:7844 },

    { id:'m159', youtubeId:'EM2Fnp_qnE8', title:'Underneath The Tree', artist:'Kelly Clarkson',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ee/40/2d/ee402d50-4a55-bcbe-b71c-6690784d4d37/886444201209.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/6/7/3/0/673f769858145a1f88c7822c9f970d5a.mp3?hdnea=exp=1780489446~acl=/api/1/1/6/7/3/0/673f769858145a1f88c7822c9f970d5a.mp3*~data=user_id=0,application_id=42~hmac=98926b0a73679a2d3325d21d4d6ac3a1e38a7125e4437eb9b3d347f3e9d55768',
      likes:2331 },

    { id:'m160', youtubeId:'izGwDsrQ1eQ', title:'Careless Whisper', artist:'George Michael',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/89/46/95/8946959a-e959-f22d-ced2-745feb799454/mzm.upagbaeg.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/a/9/1/0/a91845f6dd1265c2f85a3f716d9029e5.mp3?hdnea=exp=1780489449~acl=/api/1/1/a/9/1/0/a91845f6dd1265c2f85a3f716d9029e5.mp3*~data=user_id=0,application_id=42~hmac=dc95c22016d30361031a7d009e4e7c136e1db888591556bf74040c20ac789bd5',
      likes:6300 },

    { id:'m161', youtubeId:'NmxFxBiCrL4', title:'Mary On A Cross', artist:'Ghost',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/20/72/d3/2072d3b2-238c-1ac2-1f6f-21f683fdc41b/24CRGIM45902.rgb.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/7/2/d/0/72d64f5a613d4e06fbb701f0e2851d3f.mp3?hdnea=exp=1780489452~acl=/api/1/1/7/2/d/0/72d64f5a613d4e06fbb701f0e2851d3f.mp3*~data=user_id=0,application_id=42~hmac=ed6bf906dc2f2c642a6574d5f57789d1d8b38706363c3553cfed0fcfe60a6fb0',
      likes:2269 },

    { id:'m162', youtubeId:'C-cKU8xisRo', title:'Don\'t Get Much Better', artist:'Jeremih, Ty Dolla $ign, Sage The Gemini',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/7a/8d/80/7a8d80db-d1a8-e64c-eeb8-25f89c2126a9/075679897824.jpg/600x600bb.jpg',
      previewUrl:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/63/ae/1e/63ae1eee-2757-4abb-f35e-a41dde59718d/mzaf_6976051352278897057.plus.aac.p.m4a',
      likes:3452 },

    { id:'m163', youtubeId:'GdJP11JwLos', title:'Crying Over You', artist:'HONNE',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/37/dc/43/37dc437b-f8d8-d836-4d13-b652ae88f8dc/075679807526.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/2/5/e/0/25ed4c6d7c6d7388be02009dfadc8eed.mp3?hdnea=exp=1780489460~acl=/api/1/1/2/5/e/0/25ed4c6d7c6d7388be02009dfadc8eed.mp3*~data=user_id=0,application_id=42~hmac=1ebcd491c57621aa115a4ecd372a239753b630a064629605192ca8ba7886d226',
      likes:4819 },

    { id:'m164', youtubeId:'WXOlNBDVt0o', title:'no song without you', artist:'HONNE',
      tags:['season','season-winter'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/b23a9edb3f93327c186f6d7e99ea16bb/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/a/2/8/0/a28d5a1271cc9c146d21bf36666b6e1f.mp3?hdnea=exp=1780489463~acl=/api/1/1/a/2/8/0/a28d5a1271cc9c146d21bf36666b6e1f.mp3*~data=user_id=0,application_id=42~hmac=b5202e26acf939763f0ff613e2f24433f8402b8bb9e3e22e6e92758d1165bd94',
      likes:1303 },

    { id:'m165', youtubeId:'LQC3dBWS_FE', title:'Someone That Loves You', artist:'HONNE',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f2/f4/4f/f2f44faf-58f8-0808-f243-682dfebd6431/190295953188.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/8/3/a/0/83af7cfa7f697efac720ac6660380c10.mp3?hdnea=exp=1780489466~acl=/api/1/1/8/3/a/0/83af7cfa7f697efac720ac6660380c10.mp3*~data=user_id=0,application_id=42~hmac=50fff0f5cf56506f39a7c1c2a5346c1ab9ee999d1ea990d28791bfe76c6b9287',
      likes:6421 },

    { id:'m166', youtubeId:'bhk-yqnGlpM', title:'505', artist:'Arctic Monkeys',
      tags:['season','season-winter'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/d7a4f9f1af8736457de34f28d50ef496/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/3/2/9/0/329517eb3334d90587e141ae5ace1f40.mp3?hdnea=exp=1780489469~acl=/api/1/1/3/2/9/0/329517eb3334d90587e141ae5ace1f40.mp3*~data=user_id=0,application_id=42~hmac=448522fdb06117aa859ef8524f4cb19fdd99080e0065d2f364950e7ac26b2328',
      likes:5923 },

    { id:'m167', youtubeId:'gset79KMmt0', title:'Snowman', artist:'Sia',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/85/c3/21/85c32113-1c4c-571c-7602-88f568d8081c/075679861016.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/9/9/a/0/99afdf0a314902829bd27fc58e48bf0c.mp3?hdnea=exp=1780489472~acl=/api/1/1/9/9/a/0/99afdf0a314902829bd27fc58e48bf0c.mp3*~data=user_id=0,application_id=42~hmac=6cf8c3e83281bd8fdaebb34168a68c547b7b98c9c3ccb666e6428e97a5f539a1',
      likes:9784 },

    { id:'m168', youtubeId:'z1rYmzQ8C9Q', title:'Christmas Lights', artist:'Coldplay',
      tags:['season','season-winter'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/10d35e8b51654e2a3fcce5cddfa4437d/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/b/f/4/0/bf4a2ac9ae9c4175eb979c7685296256.mp3?hdnea=exp=1780489475~acl=/api/1/1/b/f/4/0/bf4a2ac9ae9c4175eb979c7685296256.mp3*~data=user_id=0,application_id=42~hmac=89a66990c6df1ea45b553513f898da8cf4830182959f39e0e9e9828f10db26eb',
      likes:3551 },

    { id:'m169', youtubeId:'GCdwKhTtNNw', title:'Sweater Weather', artist:'The Neighbourhood',
      tags:['season','season-winter'],
      imgUrl:'https://e-cdns-images.dzcdn.net/images/cover/6f55ff3cc5c478510c948024e95cf8d6/500x500-000000-80-0-0.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/e/7/3/0/e73b0f2f9d4693c21c4df88ee6ea5d62.mp3?hdnea=exp=1780489478~acl=/api/1/1/e/7/3/0/e73b0f2f9d4693c21c4df88ee6ea5d62.mp3*~data=user_id=0,application_id=42~hmac=af7015fbbf0b228a7b4b02a39558557a29bb6f9beacf3fa9991ce13f8c449246',
      likes:5468 },

    { id:'m170', youtubeId:'y1cBhJLNNXU', title:'Glue Song', artist:'beabadoobee',
      tags:['season','season-winter'],
      imgUrl:'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/76/6e/b6/766eb6e4-d746-00cf-7009-5d3719854f65/196922349447_Cover.jpg/600x600bb.jpg',
      previewUrl:'https://cdnt-preview.dzcdn.net/api/1/1/3/1/5/0/3152e49280f813f289fe784725f2271a.mp3?hdnea=exp=1780489481~acl=/api/1/1/3/1/5/0/3152e49280f813f289fe784725f2271a.mp3*~data=user_id=0,application_id=42~hmac=d714990ed9ac351c26e795b88e97a98238411f1798e70f5275a1c43f744d6ccd',
      likes:3446 }
];

// ─── FALLBACK 이미지 (순수 ASCII만 사용) ───
const FALLBACK_IMG = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">' +
    '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" style="stop-color:#1a0533"/>' +
    '<stop offset="100%" style="stop-color:#2d1b69"/>' +
    '</linearGradient></defs>' +
    '<rect width="300" height="300" fill="url(#bg)"/>' +
    '<circle cx="150" cy="150" r="65" fill="none" stroke="#a855f7" stroke-width="3" opacity="0.7"/>' +
    '<polygon points="130,120 130,180 185,150" fill="#a855f7" opacity="0.9"/>' +
    '</svg>'
);
window.FALLBACK_IMG = FALLBACK_IMG;

// ─── 카드 HTML ───
function createMusicCard(music) {
    const imgSrc = music.imgUrl || FALLBACK_IMG;
    return `
        <article class="music-card" data-music-id="${music.id}">
            <div class="card-image-wrap">
                <img src="${imgSrc}" alt="${music.title}" class="card-image" loading="lazy"
                     onerror="this.onerror=null;this.src=window.FALLBACK_IMG;">
                <div class="play-overlay">
                    <button class="btn-play-preview" onclick="window.playMusic('${music.id}')">
                        <i class="ph-fill ph-play"></i>
                    </button>
                </div>
            </div>
            <div class="card-info">
                <h4>${music.title}</h4>
                <p>${music.artist}</p>
            </div>
        </article>`;
}

// ─── DOM ───
const welcomeScreen      = document.getElementById('welcome-screen');
const appContent         = document.getElementById('app-content');
const musicFeedContainer = document.getElementById('music-feed-container');
const subPageContainer   = document.getElementById('sub-page-container');
const searchInput        = document.getElementById('search-input');

let isPlaying = false;
let currentPlayingId = null;

document.addEventListener('DOMContentLoaded', () => {
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    appContent.classList.remove('hidden');
    appContent.classList.add('visible');
    renderFeedSections(musicData);
    setupAudioPlayer();
});

// ─── 메인 피드 ───
function renderFeedSections(data) {
    if (!data.length) {
        musicFeedContainer.innerHTML = `<div class="empty-state"><i class="ph ph-ghost"></i><p>검색 결과가 없어요.</p></div>`;
        return;
    }
    let html = '';
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    html += `
        <section class="feed-section">
            <h3 class="section-title">오늘의 랜덤 추천 🎧</h3>
            <div class="music-grid">${shuffled.slice(0,8).map(m => createMusicCard(m)).join('')}</div>
        </section>`;

    categories.filter(c => c.id !== 'all').forEach(cat => {
        const catMusic = data.filter(m => m.tags.includes(cat.id));
        if (!catMusic.length) return;
        const hasSub = !!subCategories[cat.id];
        const title = hasSub
            ? `<h3 class="section-title clickable" onclick="window.openSubPage('${cat.id}','${cat.name}')">${cat.name} <i class="ph-bold ph-caret-right"></i></h3>`
            : `<h3 class="section-title">${cat.name}</h3>`;
        html += `<section class="feed-section">${title}<div class="music-scroll">${catMusic.map(m => createMusicCard(m)).join('')}</div></section>`;
    });
    musicFeedContainer.innerHTML = html;
}

// ─── 서브페이지 ───
window.openSubPage = function(catId, catName) {
    musicFeedContainer.classList.add('hidden');
    subPageContainer.classList.remove('hidden');
    document.getElementById('sub-page-title').textContent = catName;
    const nav = document.getElementById('sub-category-nav');
    const subs = subCategories[catId] || [];
    if (subs.length) {
        nav.innerHTML = subs.map((s,i) =>
            `<button class="btn-category ${i===0?'active':''}" onclick="window.renderSubMusic('${s.id}',this)">${s.name}</button>`
        ).join('');
        window.renderSubMusic(subs[0].id, nav.querySelector('.btn-category'));
    } else { nav.innerHTML = ''; window.renderSubMusic(catId, null); }
};

window.renderSubMusic = function(tagId, btn) {
    if (btn) { document.querySelectorAll('#sub-category-nav .btn-category').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }
    let filtered = musicData.filter(m => m.tags.includes(tagId));
    if (['season-spring', 'season-summer', 'season-fall', 'season-winter'].includes(tagId)) {
        filtered = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 9);
    }
    const grid = document.getElementById('sub-music-grid');
    grid.innerHTML = filtered.length ? filtered.map(m => createMusicCard(m)).join('') : `<div class="empty-state"><i class="ph ph-ghost"></i><p>이 카테고리엔 아직 음악이 없어요.</p></div>`;
};

document.getElementById('btn-back-main').addEventListener('click', () => {
    subPageContainer.classList.add('hidden');
    musicFeedContainer.classList.remove('hidden');
});

// ─── 검색 (iTunes 실시간, 중복 제거) ───
let searchTimeout;
searchInput.addEventListener('input', e => {
    const q = e.target.value.trim();
    clearTimeout(searchTimeout);
    if (!q) { renderFeedSections(musicData); return; }

    searchTimeout = setTimeout(async () => {
        subPageContainer.classList.add('hidden');
        musicFeedContainer.classList.remove('hidden');
        musicFeedContainer.innerHTML = `<div class="empty-state"><i class="ph ph-spinner-gap" style="animation:spin 1s linear infinite;"></i><p>전 세계의 음원을 실시간으로 찾는 중이에요...</p></div>`;
        try {
            const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=30&country=KR`);
            const data = await res.json();
            if (data.results?.length) {
                const seen = new Set();
                const unique = data.results.filter(t => { if (!t.trackId || seen.has(t.trackId)) return false; seen.add(t.trackId); return true; });
                const results = unique.map(t => ({
                    id:`itunes-${t.trackId}`, title:t.trackName||'알 수 없는 곡', artist:t.artistName||'알 수 없는 아티스트', tags:[],
                    imgUrl:t.artworkUrl100?t.artworkUrl100.replace('100x100bb','600x600bb'):'',
                    previewUrl:t.previewUrl||'', likes:Math.floor(Math.random()*500)+10
                }));
                results.forEach(r => { if (!musicData.find(m => m.id === r.id)) musicData.push(r); });
                musicFeedContainer.innerHTML = `<section class="feed-section"><h3 class="section-title">'${q}' 검색 결과 (${results.length}곡)</h3><div class="music-grid">${results.map(m => createMusicCard(m)).join('')}</div></section>`;
            } else {
                musicFeedContainer.innerHTML = `<div class="empty-state"><i class="ph ph-ghost"></i><p>'${q}'에 대한 검색 결과가 없어요.</p></div>`;
            }
        } catch(err) {
            console.error(err);
            musicFeedContainer.innerHTML = `<div class="empty-state"><i class="ph ph-warning-circle"></i><p>검색 중 오류가 발생했어요.</p></div>`;
        }
    }, 500);
});

// ─── 글로벌 플레이어 ───
const globalPlayer = document.getElementById('global-player');
const btnPlayPause = document.getElementById('btn-play-pause');
let ytPlayer = null;
let ytPlayerReady = false;
let progressInterval = null;

window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '200',
        width: '200',
        videoId: 'llsR2eTdlI4', // 초기 videoId가 없으면 onReady가 호출되지 않을 수 있음
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    ytPlayerReady = true;
    console.log("YouTube Player is ready!");
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        btnPlayPause.innerHTML = '<i class="ph-fill ph-pause-circle"></i>';
        if (!progressInterval) {
            progressInterval = setInterval(updateProgressBar, 500);
        }
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        isPlaying = false;
        btnPlayPause.innerHTML = '<i class="ph-fill ph-play-circle"></i>';
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
        if (event.data == YT.PlayerState.ENDED) {
            document.getElementById('progress-bar').style.width = '0%';
        }
    }
}

function updateProgressBar() {
    if (ytPlayer && isPlaying) {
        const duration = ytPlayer.getDuration();
        const currentTime = ytPlayer.getCurrentTime();
        if (duration > 0) {
            document.getElementById('progress-bar').style.width = `${(currentTime / duration) * 100}%`;
        }
    }
}

window.playMusic = function(id) {
    const music = musicData.find(m => m.id === id);
    if (!music) return;
    const thumb = document.getElementById('player-thumb');
    thumb.src = music.imgUrl || FALLBACK_IMG;
    thumb.onerror = function() { this.onerror=null; this.src=FALLBACK_IMG; };
    document.getElementById('player-title').textContent = music.title;
    document.getElementById('player-artist').textContent = music.artist;
    globalPlayer.classList.remove('hidden');
    
    if (currentPlayingId === id && isPlaying) { 
        if(ytPlayerReady) ytPlayer.pauseVideo(); 
    }
    else {
        // Fallback to id if youtubeId is not present temporarily
        const yId = music.youtubeId || music.id;
        if (yId && yId.length >= 11) { 
            if(ytPlayerReady) {
                if (currentPlayingId === id) {
                    ytPlayer.playVideo();
                } else {
                    ytPlayer.loadVideoById(yId);
                }
            } else {
                showToast('유튜브 플레이어를 준비 중입니다. 잠시 후 시도해주세요.');
            }
        }
        else { showToast('이 곡은 재생 정보를 지원하지 않아요 😥'); }
        currentPlayingId = id;
    }
};

function setupAudioPlayer() {
    btnPlayPause.addEventListener('click', () => { 
        if (!currentPlayingId || !ytPlayerReady) return; 
        isPlaying ? ytPlayer.pauseVideo() : ytPlayer.playVideo(); 
    });
}

// ─── 챗봇 ───
const chatbotFab    = document.getElementById('chatbot-fab');
const chatbotWindow = document.getElementById('chatbot-window');
const chatInput     = document.getElementById('chat-input');
const btnSendChat   = document.getElementById('btn-send-chat');
const chatMessages  = document.getElementById('chat-messages');

chatbotFab.addEventListener('click', () => chatbotWindow.classList.remove('hidden'));
document.getElementById('btn-close-chat').addEventListener('click', () => chatbotWindow.classList.add('hidden'));

async function callAIApi() {
    return new Promise(resolve => {
        setTimeout(() => resolve("지금 딱 어울리는 감성의 음악을 찾아봤어요.\n추천 곡: **백예린 - Square**\n들어보시면 마음이 편안해질 거예요!"), 1500);
    });
}

btnSendChat.addEventListener('click', async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatMessages.innerHTML += `<div class="message user-message"><div class="msg-bubble">${text}</div></div>`;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    const lid = "msg-" + Date.now();
    chatMessages.innerHTML += `<div id="${lid}" class="message ai-message"><div class="msg-bubble">AI가 맞춤 음악을 생각하는 중... 🤔</div></div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    try {
        const reply = await callAIApi(text);
        document.getElementById(lid).innerHTML = `<div class="msg-bubble">${reply.replace(/\n/g,'<br>')}</div>`;
    } catch(e) {
        document.getElementById(lid).innerHTML = `<div class="msg-bubble">API 호출에 실패했어요.</div>`;
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') btnSendChat.click(); });

function showToast(msg) {
    const t = document.getElementById('toast-notification');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}



