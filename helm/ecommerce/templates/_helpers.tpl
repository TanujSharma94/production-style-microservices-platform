{{/*
Common labels
*/}}
{{- define "ecommerce.labels" -}}
app.kubernetes.io/part-of: ecommerce
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end -}}

{{/*
In-cluster DNS name of the single MongoDB replica set member
*/}}
{{- define "ecommerce.mongoHost" -}}
{{ printf "mongo-0.mongo.%s.svc.cluster.local:27017" .Release.Namespace }}
{{- end -}}
