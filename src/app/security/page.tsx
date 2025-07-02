import { ContentLayout } from '@/components/layout/Layout'
import { Shield, Lock, Eye, Server, UserCheck, FileText, CheckCircle, AlertCircle, Globe, Award } from 'lucide-react'

export default function SecurityPage() {
  const securityMeasures = [
    {
      icon: Lock,
      title: 'データ暗号化',
      description: '全データはAES-256ビット暗号化により保護',
      details: [
        '通信時：TLS 1.3による暗号化',
        '保存時：AES-256ビット暗号化',
        'データベース：Transparent Data Encryption',
        'バックアップ：暗号化されたストレージ'
      ]
    },
    {
      icon: UserCheck,
      title: 'アクセス制御',
      description: '多層防御による厳格なアクセス管理',
      details: [
        '多要素認証（MFA）の必須化',
        '役割ベースアクセス制御（RBAC）',
        '最小権限の原則',
        'ゼロトラスト・セキュリティモデル'
      ]
    },
    {
      icon: Server,
      title: 'インフラセキュリティ',
      description: 'エンタープライズグレードのクラウドインフラ',
      details: [
        'AWS/GCP SOC 2 Type II準拠',
        'ネットワーク分離・ファイアウォール',
        'DDoS攻撃対策',
        '24/7監視・侵入検知システム'
      ]
    },
    {
      icon: Eye,
      title: '監査・ログ管理',
      description: '全活動の詳細な記録と分析',
      details: [
        'すべてのアクセスログを記録',
        'リアルタイム異常検知',
        '改ざん防止ログシステム',
        '法的要件に準拠した保管期間'
      ]
    }
  ]

  const certifications = [
    {
      icon: Award,
      title: 'ISO 27001',
      description: '情報セキュリティマネジメントシステム',
      status: '認証取得済み',
      year: '2024年3月'
    },
    {
      icon: Shield,
      title: 'SOC 2 Type II',
      description: 'セキュリティ・可用性・機密性の監査',
      status: '認証取得済み',
      year: '2024年6月'
    },
    {
      icon: FileText,
      title: 'プライバシーマーク',
      description: '個人情報保護の適切な取り組み',
      status: '認定取得済み',
      year: '2023年12月'
    },
    {
      icon: Globe,
      title: 'GDPR準拠',
      description: 'EU一般データ保護規則への対応',
      status: '完全準拠',
      year: '継続対応'
    }
  ]

  const privacyPrinciples = [
    {
      title: 'データ最小化',
      description: '目的達成に必要最小限のデータのみを収集・処理します'
    },
    {
      title: '透明性',
      description: 'データ処理の目的・方法を明確に説明し、同意を得ます'
    },
    {
      title: 'ユーザー権利',
      description: 'アクセス、訂正、削除、ポータビリティの権利を保障します'
    },
    {
      title: '目的制限',
      description: '収集したデータは明示した目的以外では使用しません'
    },
    {
      title: 'データ品質',
      description: '正確で最新のデータ維持に努めます'
    },
    {
      title: '保存期間制限',
      description: '必要な期間を超えてデータを保持しません'
    }
  ]

  const incidentResponse = [
    {
      step: 1,
      title: '検知・初期対応',
      time: '15分以内',
      description: 'セキュリティ監視システムによる自動検知と初期評価'
    },
    {
      step: 2,
      title: 'インシデント分析',
      time: '1時間以内',
      description: '影響範囲の特定と脅威レベルの評価'
    },
    {
      step: 3,
      title: '封じ込め・対策',
      time: '4時間以内',
      description: '被害拡大防止とシステムの安全性確保'
    },
    {
      step: 4,
      title: '復旧・報告',
      time: '24時間以内',
      description: 'サービス復旧と関係機関への報告'
    },
    {
      step: 5,
      title: '事後検証',
      time: '1週間以内',
      description: '原因分析と再発防止策の策定・実装'
    }
  ]

  return (
    <ContentLayout>
      {/* ヒーローセクション */}
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          セキュリティ
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          はじめて.AIは、お客様の大切なデータと学習情報を守るため、
          業界最高水準のセキュリティ対策を実施しています。
        </p>
      </div>

      {/* セキュリティステートメント */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 border border-green-100 dark:border-green-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              セキュリティへのコミットメント
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
              私たちは、お客様の信頼が何よりも重要であると考えています。
              そのため、国際的なセキュリティ基準に準拠し、継続的な改善を通じて、
              お客様のデータを確実に保護することをお約束します。
            </p>
          </div>
        </div>
      </div>

      {/* セキュリティ対策 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          セキュリティ対策
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityMeasures.map((measure, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <measure.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {measure.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {measure.description}
                  </p>
                  <ul className="space-y-2">
                    {measure.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 認証・コンプライアンス */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          認証・コンプライアンス
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <cert.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {cert.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {cert.description}
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {cert.status}
                </div>
                <div className="text-gray-500 dark:text-gray-500 text-xs">
                  {cert.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* プライバシー保護 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          プライバシー保護の原則
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {privacyPrinciples.map((principle, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {principle.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* インシデント対応 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
          インシデント対応プロセス
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {incidentResponse.map((step, index) => (
              <div 
                key={index}
                className="flex items-start gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-lg flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {step.title}
                    </h3>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-sm font-medium rounded-full">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 継続的改善 */}
      <div className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
            継続的なセキュリティ改善
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">定期監査</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                第三者機関による年2回の包括的セキュリティ監査
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">従業員教育</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                全従業員への月次セキュリティトレーニング実施
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">脆弱性対策</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                日次脆弱性スキャンとペネトレーションテスト
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* お問い合わせCTA */}
      <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">
          セキュリティに関するご質問
        </h2>
        <p className="text-xl mb-8 opacity-90">
          セキュリティ対策や個人情報保護についてご不明な点がございましたら、
          お気軽にお問い合わせください
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            お問い合わせ
          </a>
          <a
            href="/privacy"
            className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
          >
            プライバシーポリシー
          </a>
        </div>
      </div>
    </ContentLayout>
  )
}

export const metadata = {
  title: 'セキュリティ - はじめて.AI',
  description: 'はじめて.AIのセキュリティ対策と個人情報保護について。ISO27001認証、SOC2準拠など業界最高水準のセキュリティでお客様のデータを保護します。'
}