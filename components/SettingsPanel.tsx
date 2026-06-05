"use client";

import { useEffect, useState } from "react";

interface RestaurantSettings {
  whatsappEnabled: boolean;
  whatsappMessage: string;
  autoApprove: boolean;
  requirePayment: boolean;
  minGuestCount: number;
  maxGuestCount: number;
}

interface SettingsPanelProps {
  restaurantId: string;
  token: string;
}

export default function SettingsPanel({
  restaurantId,
  token,
}: SettingsPanelProps) {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [restaurantId, token]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/restaurants/settings?restaurantId=${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else if (response.status === 404) {
        // Initialize with defaults
        setSettings({
          whatsappEnabled: true,
          whatsappMessage: "Olá! Sua reserva foi confirmada. Código: {code}",
          autoApprove: false,
          requirePayment: false,
          minGuestCount: 1,
          maxGuestCount: 100,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/restaurants/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          ...settings,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando configurações...</div>;
  }

  if (!settings) {
    return <div className="text-center py-8">Erro ao carregar configurações</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Configurações</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Configurações salvas com sucesso!
        </div>
      )}

      {/* WhatsApp Settings */}
      <div className="border-b border-gray-200 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
            <p className="text-sm text-gray-600">
              Enviar mensagens de confirmação via WhatsApp
            </p>
          </div>
          <button
            onClick={() =>
              setSettings({ ...settings, whatsappEnabled: !settings.whatsappEnabled })
            }
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
              settings.whatsappEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                settings.whatsappEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {settings.whatsappEnabled && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem personalizada
            </label>
            <textarea
              value={settings.whatsappMessage}
              onChange={(e) =>
                setSettings({ ...settings, whatsappMessage: e.target.value })
              }
              placeholder="Use {code} para o código de confirmação"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use {"{code}"} para inserir o código de confirmação automaticamente
            </p>
          </div>
        )}
      </div>

      {/* Auto Approval Settings */}
      <div className="border-b border-gray-200 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Aprovação Automática
            </h3>
            <p className="text-sm text-gray-600">
              Aprovar reservas automaticamente dentro dos critérios
            </p>
          </div>
          <button
            onClick={() =>
              setSettings({ ...settings, autoApprove: !settings.autoApprove })
            }
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
              settings.autoApprove ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                settings.autoApprove ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {settings.autoApprove && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mínimo de hóspedes
                </label>
                <input
                  type="number"
                  value={settings.minGuestCount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minGuestCount: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de hóspedes
                </label>
                <input
                  type="number"
                  value={settings.maxGuestCount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxGuestCount: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Reservas com número de hóspedes entre {settings.minGuestCount} e{" "}
              {settings.maxGuestCount} serão aprovadas automaticamente.
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition font-medium"
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </div>
  );
}
