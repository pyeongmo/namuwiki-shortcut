# namuwiki-extension

이 크롬 확장 프로그램은 나무위키의 사용자 경험을 개선합니다.

## 기능

- **검색창 포커스:** namu.wiki의 모든 페이지에서 `/` 키를 누르면 즉시 검색창에 입력할 수 있습니다. (입력 필드에 포커스가 있는 경우는 제외)
- **인라인 각주:** 데스크톱 등 넓은 화면에서 볼 때, 각주 내용을 페이지 오른쪽 여백에 표시하여 스크롤 없이 바로 확인할 수 있습니다. 이 기능은 브라우저 창에 충분한 여유 공간이 있을 때만 자동으로 활성화됩니다.

## 소스 코드

이 확장 프로그램의 소스 코드는 GitHub 저장소 [pyeongmo/namuwiki-extension](https://github.com/pyeongmo/namuwiki-extension)에서 확인할 수 있습니다.

## 설치 방법

1. 이 저장소를 클론합니다: `git clone https://github.com/pyeongmo/namuwiki-extension.git`
2. 프로젝트 디렉토리로 이동하여 의존성을 설치합니다: `npm install`
3. 프로젝트를 빌드합니다: `npm run build`
4. 크롬 브라우저를 열고 `chrome://extensions`로 이동합니다.
5. 오른쪽 상단에서 "개발자 모드"를 활성화합니다.
6. "압축해제된 확장 프로그램을 로드합니다." 버튼을 클릭합니다.
7. 이 저장소의 `dist` 디렉토리를 선택합니다.
8. 이제 확장 프로그램이 설치되어 모든 namu.wiki 페이지에서 활성화됩니다.
