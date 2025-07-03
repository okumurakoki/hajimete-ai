import { ContentLayout } from '@/components/layout/Layout'
import { FileText, Shield, CreditCard, AlertCircle, Users, Scale, Mail } from 'lucide-react'

export default function TermsPage() {
  const sections = [
    {
      id: '1',
      title: '適用',
      icon: FileText,
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本規約は、はじめて.AI（以下「当社」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
            登録ユーザーの皆様（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
          </p>
        </div>
      )
    },
    {
      id: '2',
      title: '利用登録',
      icon: Users,
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            利用登録は、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、
            当社がこれを承認することによって完了するものとします。
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">登録を承認しない場合</h4>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
              <li>• 利用登録の申請に際して虚偽の事項を届け出た場合</li>
              <li>• 本規約に違反したことがある者からの申請である場合</li>
              <li>• その他、当社が利用登録を相当でないと判断した場合</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: '3',
      title: 'ユーザーIDおよびパスワードの管理',
      icon: Shield,
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">重要事項</h4>
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <li>• ユーザーIDおよびパスワードを第三者に譲渡または貸与することはできません</li>
              <li>• 不正使用が判明した場合は直ちに当社に通知してください</li>
              <li>• 当社からの指示がある場合は速やかに従ってください</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: '4',
      title: '利用料金および支払方法',
      icon: CreditCard,
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、
            当社が指定する方法により支払うものとします。
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300 text-sm">
              <strong>注意：</strong> 利用料金の支払を遅滞した場合、年14.6％の割合による遅延損害金が発生します。
            </p>
          </div>
        </div>
      )
    },
    {
      id: '5',
      title: '禁止事項',
      icon: AlertCircle,
      content: (
        <div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '法令または公序良俗に違反する行為',
              '犯罪行為に関連する行為',
              'サーバーまたはネットワークの機能を破壊・妨害する行為',
              '当社のサービス運営を妨害する行為',
              '他のユーザーの個人情報を収集・蓄積する行為',
              '不正アクセスをし、またはこれを試みる行為',
              '他のユーザーに成りすます行為',
              '反社会的勢力に利益を供与する行為',
              'その他、当社が不適切と判断する行為'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-red-500 dark:text-red-400 mt-1">×</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ]

  const additionalSections = [
    {
      title: '第6条（本サービスの提供の停止等）',
      content: `当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：

• 本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
• 地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
• コンピュータまたは通信回線等が事故により停止した場合
• その他、当社が本サービスの提供が困難と判断した場合`
    },
    {
      title: '第7条（利用制限および登録抹消）',
      content: `当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします：

• 本規約のいずれかの条項に違反した場合
• 登録事項に虚偽の事実があることが判明した場合
• 利用料金等の支払債務の不履行があった場合
• 当社からの連絡に対し、一定期間返答がない場合
• 本サービスについて、最終の利用から一定期間利用がない場合
• その他、当社が本サービスの利用を適当でないと判断した場合`
    },
    {
      title: '第8条（退会）',
      content: 'ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。'
    },
    {
      title: '第9条（保証の否認および免責事項）',
      content: `当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。

当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。`
    },
    {
      title: '第10条（サービス内容の変更等）',
      content: '当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。'
    },
    {
      title: '第11条（利用規約の変更）',
      content: '当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。'
    },
    {
      title: '第12条（個人情報の取扱い）',
      content: '当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。'
    },
    {
      title: '第13条（通知または連絡）',
      content: 'ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。'
    },
    {
      title: '第14条（権利義務の譲渡の禁止）',
      content: 'ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。'
    },
    {
      title: '第15条（準拠法・裁判管轄）',
      content: '本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。'
    }
  ]

  return (
    <ContentLayout>
      {/* ヒーローセクション */}
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scale className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          利用規約
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          はじめて.AIのサービスを安心してご利用いただくための<br />
          利用条件を定めています。
        </p>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          最終更新日: 2024年6月19日
        </div>
      </div>

      {/* 主要条項 */}
      <div className="mb-12 space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                <section.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  第{section.id}条（{section.title}）
                </h2>
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* その他の条項 */}
      <div className="space-y-8">
        {additionalSections.map((section, index) => (
          <section key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {section.title}
            </h2>
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      {/* お問い合わせCTA */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <Mail className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          利用規約に関するお問い合わせ
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          利用規約の内容や条件に関するご質問・ご相談がございましたら、
          お気軽にお問い合わせください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            お問い合わせフォーム
          </a>
          <a
            href="mailto:info@oku-ai.co.jp"
            className="inline-flex items-center px-8 py-3 border border-white text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            直接メール送信
          </a>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: '利用規約 - はじめて.AI',
  description: 'はじめて.AIの利用規約。サービス利用時の規則、ユーザーの権利と義務について詳しく説明しています。安心してご利用いただくための条件をご確認ください。'
}