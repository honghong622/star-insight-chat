const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background px-5 py-14">
      <h1 className="mb-8 text-2xl font-extrabold text-foreground">이용약관</h1>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제1조 (목적)</h2>
          <p>
            본 약관은 별자리 인사이트(이하 "서비스")가 토스 앱 내에서 제공하는 AI 점성술 상담 서비스의
            이용 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제2조 (용어의 정의)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>"서비스"란 회사가 토스 앱 내에서 제공하는 AI 기반 점성술 상담 서비스를 말합니다.</li>
            <li>"이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
            <li>"콘텐츠"란 서비스를 통해 제공되는 운세, 상담 내용 등 모든 정보를 말합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제3조 (약관의 효력 및 변경)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
            <li>회사는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자 7일 전부터 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제4조 (서비스의 제공 및 변경)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>서비스는 AI 기반 점성술 상담, 운세 콘텐츠 제공 등을 포함합니다.</li>
            <li>서비스의 내용은 운영상·기술상 필요에 의해 변경될 수 있으며, 변경 시 사전 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제5조 (서비스 이용료 및 결제)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>서비스의 일부는 유료로 제공되며, 이용료는 서비스 내 결제 화면에 표시됩니다.</li>
            <li>결제는 토스 앱 내 결제 시스템을 통해 처리됩니다.</li>
            <li>이용자가 결제를 완료하면 즉시 서비스를 이용할 수 있습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제6조 (청약철회 및 환불)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>이용자는 결제일로부터 7일 이내에 청약철회를 요청할 수 있습니다. 단, 이미 서비스를 이용한 경우(질문을 1회 이상 사용한 경우)에는 환불이 제한될 수 있습니다.</li>
            <li>환불은 결제 수단에 따라 처리되며, 처리 기간은 결제 수단별로 상이할 수 있습니다.</li>
            <li>환불 요청은 서비스 내 고객센터 또는 이메일을 통해 접수할 수 있습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제7조 (이용자의 의무)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>이용자는 서비스를 이용함에 있어 관련 법령 및 본 약관의 규정을 준수해야 합니다.</li>
            <li>이용자는 서비스를 통해 얻은 정보를 상업적 목적으로 이용하거나 제3자에게 제공할 수 없습니다.</li>
            <li>이용자는 타인의 개인정보를 무단으로 수집하거나 이용해서는 안 됩니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제8조 (면책조항)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>서비스에서 제공하는 콘텐츠는 AI가 생성한 엔터테인먼트 목적의 정보이며, 전문적인 상담을 대체하지 않습니다.</li>
            <li>회사는 서비스를 통해 제공된 정보에 기반한 이용자의 판단이나 행위에 대해 책임을 지지 않습니다.</li>
            <li>천재지변, 시스템 장애 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제9조 (개인정보 처리)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.</li>
            <li>수집하는 개인정보: 생년월일, 출생 시간(선택), 출생 도시(선택)</li>
            <li>수집된 개인정보는 서비스 제공 목적으로만 사용되며, 제3자에게 제공되지 않습니다.</li>
            <li>이용자는 언제든지 개인정보의 삭제를 요청할 수 있습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-base font-bold text-foreground">제10조 (분쟁 해결)</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 상호 협의하여 해결합니다.</li>
            <li>협의가 이루어지지 않을 경우, 관할 법원에 소를 제기할 수 있습니다.</li>
          </ol>
        </section>

        <section className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            본 약관은 2026년 3월 13일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
