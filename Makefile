all:
		ng build --prod --base-href="walking-simulator"
		cp server/*.geojson dist/walking-simulator/
