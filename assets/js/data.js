/* Portfolio public data. */
window.PORTFOLIO = {
  "ui": {
    "homeLabel": "포트폴리오",
    "portfolioHeading": "포트폴리오"
  },
  "profile": {
    "name": "정로지",
    "role": "3D 디자이너",
    "intro": "형태, 재질, 조명과 제작 판단을 하나의 프로젝트 흐름 안에서 보여주는 3D 디자이너 포트폴리오.",
    "disciplines": [
      "모델링",
      "룩디벨롭",
      "조명",
      "시각화"
    ],
    "workStyleTitle": "작업 방식",
    "workStyleItems": [
      {
        "text": "형태와 비율을 먼저 읽고 구조를 정리합니다.",
        "media": []
      },
      {
        "text": "재질과 조명은 형태 가독성을 기준으로 테스트합니다.",
        "media": [
          {
            "src": "assets/media/msn9vjzm-a02afc79-factory.png",
            "alt": "factory",
            "caption": ""
          }
        ]
      },
      {
        "text": "최종 결과와 함께 과정의 선택 이유를 보여줍니다.",
        "media": []
      }
    ]
  },
  "experience": [
    {
      "period": "2026.03 — 현재",
      "role": "3D 디자이너",
      "project": "사내 비공개 프로젝트",
      "scope": "모델링 · 룩디벨롭 · 시각화"
    },
    {
      "period": "2025.01 — 2026.02",
      "role": "3D 디자이너",
      "project": "비공개 프로젝트",
      "scope": "에셋 제작 · 재질 · 조명"
    },
    {
      "period": "2024.04 — 2024.12",
      "role": "3D 제작 / 디자인 지원",
      "project": "내부 제작 업무",
      "scope": "모델링 · 렌더링 · 디자인 지원"
    }
  ],
  "portfolioSections": [
    {
      "id": "about",
      "label": "소개",
      "eyebrow": "01 · 프로필",
      "title": "3D 디자이너",
      "description": "결과 이미지뿐 아니라 어떤 판단을 거쳐 결과에 도달했는지 보여주는 포트폴리오입니다.",
      "bullets": [
        "형태와 비율을 먼저 읽고 구조를 정리합니다.",
        "재질과 조명은 형태 가독성을 기준으로 테스트합니다.",
        "최종 결과와 함께 과정의 선택 이유를 보여줍니다."
      ],
      "navSubtitle": "프로필"
    },
    {
      "id": "experience",
      "label": "경력",
      "eyebrow": "02 · 경력",
      "title": "경력",
      "description": "회사 프로젝트는 비공개이므로 기간, 역할, 담당 범위를 중심으로 정리합니다.",
      "navSubtitle": "경력 타임라인"
    },
    {
      "id": "selected-project",
      "label": "선정 프로젝트",
      "eyebrow": "03 · 개인 프로젝트",
      "title": "선정 개인 프로젝트",
      "description": "하나의 개인 프로젝트를 콘셉트 → 모델링 → 룩디벨롭 → 최종 결과 순서로 깊게 보여줍니다.",
      "navSubtitle": "개인 프로젝트"
    }
  ],
  "stages": [
    {
      "id": "concept",
      "no": "01",
      "label": "콘셉트",
      "subtitle": "리서치와 방향 설정",
      "description": "프로젝트의 목적과 제약을 정의하고, 시각적 방향을 선택하는 단계입니다.",
      "summary": [
        "목표와 문제 정의",
        "형태 / 재질 / 분위기 레퍼런스 분류",
        "초기 옵션 비교와 방향 선택"
      ],
      "process": [
        "research",
        "reference",
        "direction"
      ],
      "media": []
    },
    {
      "id": "modeling",
      "no": "02",
      "label": "모델링",
      "subtitle": "형태와 구조",
      "description": "큰 형태부터 세부 구조까지 단계적으로 밀도를 높이며 제작 가능한 형태로 정리합니다.",
      "summary": [
        "블록아웃으로 비율과 실루엣 확인",
        "스컬프로 형태 밀도 향상",
        "토폴로지 정리와 후속 공정 준비"
      ],
      "process": [
        "blockout",
        "sculpt",
        "topology"
      ],
      "media": []
    },
    {
      "id": "lookdev",
      "no": "03",
      "label": "룩디벨롭",
      "subtitle": "재질과 조명",
      "description": "재질과 조명 테스트를 통해 표면 반응과 형태 가독성을 동시에 정리합니다.",
      "summary": [
        "셰이더 반응 테스트",
        "재질 스케일과 텍스처 밀도 조정",
        "조명 대비와 분위기 비교"
      ],
      "process": [
        "shader-test",
        "material-study",
        "lighting-test"
      ],
      "media": []
    },
    {
      "id": "final",
      "no": "04",
      "label": "최종 결과",
      "subtitle": "렌더와 리뷰",
      "description": "최종 결과물을 정리하고 초기 방향과 비교해 개선점을 보여줍니다.",
      "summary": [
        "대표 컷 / 디테일 렌더",
        "턴테이블 / 프레젠테이션 모션",
        "전후 비교 / 회고"
      ],
      "process": [
        "final-render",
        "turntable",
        "review"
      ],
      "media": []
    }
  ],
  "process": {
    "research": {
      "id": "research",
      "stage": "concept",
      "no": "01.1",
      "label": "리서치",
      "subtitle": "문제 정의",
      "description": "프로젝트 목적과 제약을 정리하고 무엇을 해결할지 먼저 정의합니다.",
      "bullets": [
        "프로젝트 목표 정리",
        "제약 조건과 우선순위 설정",
        "핵심 질문 정의"
      ],
      "tags": [
        "리서치",
        "목표",
        "제약 조건"
      ],
      "media": []
    },
    "reference": {
      "id": "reference",
      "stage": "concept",
      "no": "01.2",
      "label": "레퍼런스",
      "subtitle": "시각 언어",
      "description": "형태, 재질, 분위기 레퍼런스를 분류해 디자인 언어를 만듭니다.",
      "bullets": [
        "형태 레퍼런스 분류",
        "재질 / 표면 키워드 정리",
        "분위기와 톤 방향 설정"
      ],
      "tags": [
        "레퍼런스",
        "분위기",
        "형태"
      ],
      "media": []
    },
    "direction": {
      "id": "direction",
      "stage": "concept",
      "no": "01.3",
      "label": "방향 설정",
      "subtitle": "디자인 판단",
      "description": "여러 방향을 비교하고 최종 방향을 선택한 이유를 명확하게 보여줍니다.",
      "bullets": [
        "초기 옵션 비교",
        "장단점 검토",
        "최종 방향 선택 근거"
      ],
      "tags": [
        "판단",
        "반복 개선",
        "방향"
      ],
      "media": []
    },
    "blockout": {
      "id": "blockout",
      "stage": "modeling",
      "no": "02.1",
      "label": "블록아웃",
      "subtitle": "기본 형태",
      "description": "세부 묘사 전에 전체 비율과 실루엣이 제대로 읽히는지 빠르게 검증합니다.",
      "bullets": [
        "전체 비율 테스트",
        "실루엣 가독성 확인",
        "카메라에서 형태 검증"
      ],
      "tags": [
        "블록아웃",
        "비율",
        "실루엣"
      ],
      "media": []
    },
    "sculpt": {
      "id": "sculpt",
      "stage": "modeling",
      "no": "02.2",
      "label": "스컬프",
      "subtitle": "형태 정교화",
      "description": "큰 형태에서 중간 형태, 필요한 디테일까지 단계적으로 밀도를 올립니다.",
      "bullets": [
        "큰 형태 유지",
        "중간 형태 추가",
        "필요한 부분에 디테일 집중"
      ],
      "tags": [
        "스컬프",
        "형태",
        "디테일"
      ],
      "media": []
    },
    "topology": {
      "id": "topology",
      "stage": "modeling",
      "no": "02.3",
      "label": "토폴로지",
      "subtitle": "지오메트리 정리",
      "description": "후속 공정을 고려해 엣지 흐름과 지오메트리 밀도를 정리합니다.",
      "bullets": [
        "불필요한 지오메트리 제거",
        "엣지 흐름 정리",
        "재질 / UV 작업 준비"
      ],
      "tags": [
        "토폴로지",
        "엣지 흐름",
        "최적화"
      ],
      "media": []
    },
    "shader-test": {
      "id": "shader-test",
      "stage": "lookdev",
      "no": "03.1",
      "label": "셰이더 테스트",
      "subtitle": "표면 반응",
      "description": "거칠기와 반사값을 비교하며 표면 반응을 검증합니다.",
      "bullets": [
        "거칠기 범위 비교",
        "반사 강도 테스트",
        "표면 변화 조절"
      ],
      "tags": [
        "셰이더",
        "표면",
        "거칠기"
      ],
      "media": []
    },
    "material-study": {
      "id": "material-study",
      "stage": "lookdev",
      "no": "03.2",
      "label": "재질 연구",
      "subtitle": "재질 언어",
      "description": "형태와 스케일이 자연스럽게 읽히도록 재질 대비와 디테일을 조절합니다.",
      "bullets": [
        "재질 스케일 검증",
        "텍스처 밀도 조절",
        "형태와 재질 대비 정리"
      ],
      "tags": [
        "재질",
        "텍스처",
        "스케일"
      ],
      "media": []
    },
    "lighting-test": {
      "id": "lighting-test",
      "stage": "lookdev",
      "no": "03.3",
      "label": "조명 테스트",
      "subtitle": "분위기와 가독성",
      "description": "형태 가독성과 시선 흐름을 기준으로 키 라이트, 필 라이트, 대비를 비교합니다.",
      "bullets": [
        "키 라이트 방향 비교",
        "필 라이트 강도 조절",
        "명암 대비와 시선 흐름 확인"
      ],
      "tags": [
        "조명",
        "분위기",
        "대비"
      ],
      "media": []
    },
    "final-render": {
      "id": "final-render",
      "stage": "final",
      "no": "04.1",
      "label": "최종 렌더",
      "subtitle": "대표 프레임",
      "description": "프로젝트를 대표하는 히어로 컷과 디테일 컷을 정리합니다.",
      "bullets": [
        "대표 이미지",
        "디테일 클로즈업",
        "포트폴리오용 크롭 정리"
      ],
      "tags": [
        "렌더",
        "구도",
        "결과물"
      ],
      "media": []
    },
    "turntable": {
      "id": "turntable",
      "stage": "final",
      "no": "04.2",
      "label": "턴테이블",
      "subtitle": "오브젝트 프레젠테이션",
      "description": "형태와 재질을 한눈에 확인할 수 있도록 턴테이블 또는 짧은 모션을 보여줍니다.",
      "bullets": [
        "360° 형태 확인",
        "재질 반응 확인",
        "프레젠테이션 모션"
      ],
      "tags": [
        "턴테이블",
        "모션",
        "프레젠테이션"
      ],
      "media": []
    },
    "review": {
      "id": "review",
      "stage": "final",
      "no": "04.3",
      "label": "리뷰",
      "subtitle": "회고",
      "description": "처음과 비교해 무엇이 개선되었고 다음 작업에 무엇을 이어갈지 정리합니다.",
      "bullets": [
        "초기안과 최종안 비교",
        "개선된 지점 정리",
        "다음 프로젝트에 이어갈 점"
      ],
      "tags": [
        "리뷰",
        "전후 비교",
        "배운 점"
      ],
      "media": []
    }
  }
};
