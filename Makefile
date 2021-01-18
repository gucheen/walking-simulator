all:
		ng build --prod --base-href="walking-simulator"
		cp server/geojson/*.json dist/walking-simulator/
