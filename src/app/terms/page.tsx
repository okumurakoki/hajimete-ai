import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '利用規約',
  description: 'はじめて.AIの利用規約。サービス利用時の規則について',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                最終更新日: 2024年6月19日
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第1条（適用）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本利用規約（以下「本規約」）は、はじめて.AI（以下「当社」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
                  ユーザーの皆さま（以下「ユーザー」）には、本規約に従って、本サービスをご利用いただきます。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第2条（利用登録）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>本サービスの利用を希望する者は、本規約に同意の上、当社の定める方法によって利用登録を申請するものとします。</li>
                  <li>当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります：
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                      <li>本規約に違反したことがある者からの申請である場合</li>
                      <li>その他、当社が利用登録を相当でないと判断した場合</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</li>
                  <li>ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</li>
                  <li>ユーザーIDおよびパスワードが第三者によって使用されたことによって生じた損害は、ユーザーが負担するものとします。</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第4条（料金および支払方法）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を支払うものとします。</li>
                  <li>利用料金の支払方法は、クレジットカード決済とします。</li>
                  <li>ユーザーが利用料金の支払を遅滞した場合、ユーザーは年14.6％の割合による遅延損害金を支払うものとします。</li>
                  <li>一度支払われた利用料金は、当社に責めに帰すべき事由がある場合を除き、返金されないものとします。</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第5条（禁止事項）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>本サービスの内容等、本サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為</li>
                  <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                  <li>本サービスによって得られた情報を商業的に利用する行為</li>
                  <li>当社のサービスの運営を妨害するおそれのある行為</li>
                  <li>不正アクセスをし、またはこれを試みる行為</li>
                  <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>不正な目的を持って本サービスを利用する行為</li>
                  <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                  <li>その他、当社が不適切と判断する行為</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第6条（本サービスの提供の停止等）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                      <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                      <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                      <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                    </ul>
                  </li>
                  <li>当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第7条（著作権）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>本サービスで提供されるコンテンツの著作権は、当社または当社にコンテンツを提供している提供者に帰属します。</li>
                  <li>ユーザーは、本サービスで提供されるコンテンツを、私的利用の範囲内でのみ利用できるものとし、複製、翻案、公衆送信等の行為は禁止されています。</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第8条（利用制限および登録抹消）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします：
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>本規約のいずれかの条項に違反した場合</li>
                      <li>登録事項に虚偽の事実があることが判明した場合</li>
                      <li>料金等の支払債務の不履行があった場合</li>
                      <li>当社からの連絡に対し、一定期間返答がない場合</li>
                      <li>本サービスについて、最後の利用から一定期間利用がない場合</li>
                      <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
                    </ul>
                  </li>
                  <li>当社は、本条に基づき当社が行った行為によりユーザーに生じた損害について、一切の責任を負いません。</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第9条（退会）</h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第10条（保証の否認および免責事項）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>当社は、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。</li>
                  <li>当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。</li>
                  <li>前項ただし書に定める場合であっても、当社は、付随的損害、間接損害、特別損害、将来の損害および逸失利益にかかる損害については、一切の責任を負いません。</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第11条（サービス内容の変更等）</h2>
                <p className="text-gray-700 leading-relaxed">
                  当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第12条（利用規約の変更）</h2>
                <p className="text-gray-700 leading-relaxed">
                  当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします：
                </p>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>本規約の変更がユーザーの一般の利益に適合するとき</li>
                  <li>本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第13条（個人情報の取扱い）</h2>
                <p className="text-gray-700 leading-relaxed">
                  当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第14条（通知または連絡）</h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。
                  当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第15条（権利義務の譲渡の禁止）</h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第16条（準拠法・裁判管轄）</h2>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                  <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                  <li>本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">お問い合わせ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本規約に関するお問い合わせは、以下までご連絡ください：
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>はじめて.AI カスタマーサポート</strong><br/>
                    メールアドレス: support@hajimete-ai.com<br/>
                    受付時間: 平日 9:00-18:00（土日祝日除く）
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}