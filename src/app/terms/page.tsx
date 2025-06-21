import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '利用規約',
  description: 'はじめて.AIの利用規約。サービス利用時の規則について',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              はじめて.AI
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ホームに戻る
            </Link>
          </div>
        </div>
      </header>
      
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
                  本規約は、はじめて.AI（以下「当社」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
                  登録ユーザーの皆様（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第2条（利用登録）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  利用登録は、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、
                  当社がこれを承認することによって完了するものとします。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  当社は、利用登録の申請者に以下の事由があると判断した場合、
                  利用登録の申請を承認しないことがあります：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                  <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、当社が利用登録を相当でないと判断した場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与することはできません</li>
                  <li>ユーザーIDまたはパスワードが盗用されまたは第三者に使用されていることが判明した場合、ユーザーは直ちに当社に通知し、当社からの指示がある場合にはこれに従うものとします</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第4条（利用料金および支払方法）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、
                  当社が指定する方法により支払うものとします。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14.6％の割合による遅延損害金を支払うものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第5条（禁止事項）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当社、本サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                  <li>当社のサービスの運営を妨害するおそれのある行為</li>
                  <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>不正アクセスをし、またはこれを試みる行為</li>
                  <li>他のユーザーに成りすます行為</li>
                  <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                  <li>その他、当社が不適切と判断する行為</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第6条（本サービスの提供の停止等）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                  <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                  <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                  <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第7条（利用制限および登録抹消）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、
                  ユーザーに対して本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします：
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>本規約のいずれかの条項に違反した場合</li>
                  <li>登録事項に虚偽の事実があることが判明した場合</li>
                  <li>利用料金等の支払債務の不履行があった場合</li>
                  <li>当社からの連絡に対し、一定期間返答がない場合</li>
                  <li>本サービスについて、最終の利用から一定期間利用がない場合</li>
                  <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第8条（退会）</h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第9条（保証の否認および免責事項）</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、
                  セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
                  ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、
                  この免責規定は適用されません。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第10条（サービス内容の変更等）</h2>
                <p className="text-gray-700 leading-relaxed">
                  当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、
                  これによってユーザーに生じた損害について一切の責任を負いません。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第11条（利用規約の変更）</h2>
                <p className="text-gray-700 leading-relaxed">
                  当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                  なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第12条（個人情報の取扱い）</h2>
                <p className="text-gray-700 leading-relaxed">
                  当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第13条（通知または連絡）</h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。
                  当社は,ユーザーから,当社が別途定める方式に従った変更届け出がない限り,
                  現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い,
                  これらは,発信時にユーザーへ到達したものとみなします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第14条（権利義務の譲渡の禁止）</h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、
                  または担保に供することはできません。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">第15条（準拠法・裁判管轄）</h2>
                <p className="text-gray-700 leading-relaxed">
                  本規約の解釈にあたっては、日本法を準拠法とします。
                  本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2024 はじめて.AI. All rights reserved.
            </p>
            <div className="mt-2">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mr-4">
                ホーム
              </Link>
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 text-sm">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}