import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useApi } from "@/hooks/api/useApi"
import { DoubleAuthentificationModal } from "@/components/profil/DoubleAuthenModal"

interface TwoFactorResponse {
  qrCode: string;
  secret: string;
}

export function DoubleAuthentification() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [qrCode, setQrCode] = useState<string | undefined>(undefined)
  const [secretKey, setSecretKey] = useState<string | undefined>(undefined)

  const { refetch: enable2FA } = useApi<TwoFactorResponse>(
    "/auth/enable-2fa",
    {
      method: 'POST',
      immediate: false,
      body: JSON.stringify({}),
      onSuccess: (data) => {
        if (!data) {
          console.error("Erreur 2FA : réponse invalide", data)
          return
        }
        setQrCode(data.qrCode)
        setSecretKey(data.secret)
      },
      onError: (errMsg) => {
        console.error('Erreur 2FA :', errMsg)
      },
    }
  )

  const { refetch: disable2FA } = useApi(
    "/auth/disable2FA",
    {
      method: 'POST',
      immediate: false,
      body: JSON.stringify({}),
      onSuccess: (data) => {
        if (!data) {
          console.error("Erreur 2FA : réponse invalide", data)
        }
      },
      onError: (errMsg) => {
        console.error('Erreur 2FA :', errMsg)
      },
    }
  )

  const { refetch: check2FAStatus } = useApi(
    "/auth/check2FA",
    {
      immediate: false,
      onSuccess: (data) => {
        if (data === true)
          setIsEnabled(true)
      },
      onError: (errMsg) => {
        console.error('Erreur 2FA check :', errMsg)
      },
    }
  )

  const handleModalOpen = async () => {
    try {
      setIsModalOpen(true)
      await enable2FA()
    } catch (error) {
      console.error("Erreur lors de la génération du 2FA", error)
      setIsModalOpen(false)
    }
  }

  const SwitchClose = async () => {
    try {
      await disable2FA()
      setIsEnabled(false)
      console.log("2FA désactivée")
    } catch (error) {
      console.error("Erreur lors de la désactivation du 2FA", error)
      setIsEnabled(true)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleActivate = () => {
    if (qrCode && secretKey) {
      setIsEnabled(true)
      handleModalClose()
      console.log("2FA activée")
    } else {
      console.error("Impossible d'activer la 2FA sans données valides")
    }
  }

  const handleCancel = () => {
    setIsEnabled(false)
    handleModalClose()
  }

  useEffect(() => {
		const fetchData = async () => {
			await Promise.all([check2FAStatus()]);
		};
		fetchData();
	}, []
	);

  return (
    <div>
      <div className="flex items-center space-x-2">

        <Switch
          id="authentification"
          checked={isEnabled}
          onCheckedChange={(checked) => {
            if (checked) {
              handleModalOpen()
            } else {
              SwitchClose()
              
            }
          }}
        />
        <Label className="text-2xl" htmlFor="authentification">Activer Authentification</Label>
      </div>

      <DoubleAuthentificationModal
        open={isModalOpen}
        onClose={handleModalClose}
        qrCode={qrCode ?? ''}
        secretKey={secretKey ?? ''}
        onActivate={handleActivate}
        onCancel={handleCancel}
        setIsEnabled={setIsEnabled}
      />
    </div>
  )
}
