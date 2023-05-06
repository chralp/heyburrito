{{/*
Expand the name of the chart.
*/}}
{{- define "heyburrito.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "heyburrito.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "heyburrito.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "heyburrito.labels" -}}
helm.sh/chart: {{ include "heyburrito.chart" . }}
{{ include "heyburrito.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "heyburrito.selectorLabels" -}}
app.kubernetes.io/name: {{ include "heyburrito.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "heyburrito.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "heyburrito.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}


{{/*
Mongodb hostname
*/}}
{{- define "heyburrito.mongodb.hostname" -}}
{{ include "heyburrito.fullname" . }}-{{- if eq .Values.mongodb.architecture "replicaset" -}}mongodb-headless{{- else -}}mongodb{{- end -}}
{{- end }}


{{/*
MONGODB_URL
*/}}
{{- define "heyburrito.mongodb.url" -}}
{{- if .Values.mongodb.enabled -}}
{{- printf "mongodb://%s:%s@%s:27017" .Values.mongodb.auth.username .Values.mongodb.auth.password (include "heyburrito.mongodb.hostname" .) }}
{{- end }}
{{- end }}

{{- define "heyburrito.mongodb.env" -}}
- name: MONGODB_PORT
  value: '27017'
- name: MONGODB_HOST
  value: {{ include "heyburrito.mongodb.hostname" . }}
{{- end }}
