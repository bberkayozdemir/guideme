import React from "react"
import { Header, MapLeft, Map, MapContainer, View, MapLabel, Icon} from "../components/index.js"

import { withRouter, Link } from "react-router-dom";

import $ from "jquery"
import helpers from "../scripts/helpers"
import Accordion from "../components/accordion";
import isbike from "../sources/isbike"
import { faTimes} from '@fortawesome/free-solid-svg-icons'

const maxHata = 10

class MapPage extends React.Component{

  constructor(props) {
    super(props)
    this.props = props
    this.map = null
    this.state = {
      items:{},
      mapTriggered:false
    }

    this.items = {}

    this.error = {
      akaryakit:0,
      ispark:0,
      parkyesil:0,
      hastane:0,
      tiyatro:0,
      ibb:0
    }

    this.triggerMap = this.triggerMap.bind(this)
    this.openLocation = this.openLocation.bind(this)
  }

  componentDidMount()
  {
    window.scrollTo(0, 0)
    this.lat = this.props.match.params.lat
    this.lng = this.props.match.params.lng
    this.time = this.props.match.params.time
    this.initMap()
    this.getAkaryakit()
    this.getIsPark()
    this.getIsBike()
    this.getParkYesil()
    this.getHastane()
    this.getTiyatro()
    this.getIBB()
    
  }

  initMap()
  {
    this.map = new window.SehirHaritasiAPI({mapFrame:"map",apiKey:"3f37d6cb20724201956ce1d04c1939a4"}, () => {
        this.map.Map.Toolbar({
            network: false,
            panorama: false,
            menu: false,
            layers: false,
            search: false,
            mapSwitch: false,
            traffic: false,
            label:false,
            clear:false,
            measure:false,
            print:false,
            location:false,
        })

        

    })
  }

  async getIsPark()
  {
    var distance = 50 / 60 * parseInt(this.time)

    var sql = 'SELECT "PARK_NAME","LONGITUDE","LATITUDE",'
    +'(111.1111*DEGREES(ACOS(LEAST(1.0, COS(RADIANS("LATITUDE")))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))) AS distance_km FROM "f4f56e58-5210-4f17-b852-effe356a890c"'
    +'WHERE (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+')))))) < '+distance
    +'ORDER BY (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))))'

    try
    {
      var query = {
        sql:sql
      };
      var data = await $.ajax({
        url: 'http://data.ibb.gov.tr/api/3/action/datastore_search_sql',
        data: query,
        dataType: 'jsonp',
      });

      for (var i = 0; i < data.result.records.length; i++)
      {
        if (data.result.records[i].distance_km == null)
          continue;
        this.checkDistance(data.result.records[i], "İSPARK Lokasyonları", "PARK_NAME", "LATITUDE", "LONGITUDE", "ispark")
        
      }

      this.setState({items:this.state.items})

      console.log("ispark ok")
    }
    catch(e){
      console.log(e)
      if (this.error.ispark < maxHata){
        setTimeout(() => this.getIsPark(),500)
        console.log("hata ispark")
        this.error.ispark++
      }
        
    }
    
  }

  async getIBB()
  {
    var distance = 50 / 60 * parseInt(this.time)

    var sql = 'SELECT "LOCATION_NAME","LATITUDE","LONGITUDE" FROM "dc2a3d95-d65d-404e-a5d9-24df34cb8d2d"'

    try
    {
      var query = {
        sql:sql
      };
      var data = await $.ajax({
        url: 'http://data.ibb.gov.tr/api/3/action/datastore_search_sql',
        data: query,
        dataType: 'jsonp',
      });

      for (var i = 0; i < data.result.records.length; i++)
      {
        var dst = helpers.distance(this.lat, this.lng, data.result.records[i].LATITUDE, data.result.records[i].LONGITUDE, "K")
        if (dst < distance){
          data.result.records[i].distance_km = dst
          this.checkDistance(data.result.records[i], "IBB Lokasyonları", "LOCATION_NAME", "LATITUDE", "LONGITUDE", "ibb")
        }
      }

      this.setState({items:this.state.items})

      console.log("ibb ok")
    }
    catch(e){
      console.log(e)
      if (this.error.ibb < maxHata){
        setTimeout(() => this.getIBB(),500)
        console.log("hata ibb")
        this.error.ibb++
      }
        
    }
    
  }

  async getTiyatro()
  {
    var distance = 50 / 60 * parseInt(this.time)

    var date = helpers.today()
    date = "2021-06-26"

    var sql = 'SELECT "PLAY_DATE","PLAY_NAME","THEATER_NAME","LONGITUDE","LATITUDE",'
    +'(111.1111*DEGREES(ACOS(LEAST(1.0, COS(RADIANS("LATITUDE")))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))) AS distance_km FROM "79465ce9-8755-4b57-8e6c-def0c0caadc8"'
    +'WHERE "PLAY_DATE" = \''+date+'\' AND (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+')))))) < '+distance
    +'ORDER BY (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))))'

    try
    {
      var query = {
        sql:sql
      };
      var data = await $.ajax({
        url: 'http://data.ibb.gov.tr/api/3/action/datastore_search_sql',
        data: query,
        dataType: 'jsonp',
      });

      for (var i = 0; i < data.result.records.length; i++)
      {
        if (data.result.records[i].distance_km == null)
          continue;
          data.result.records[i].PLAY_NAME = data.result.records[i].PLAY_NAME + " - " + data.result.records[i].THEATER_NAME;
        this.checkDistance(data.result.records[i], "Şehir Tiyatroları", "PLAY_NAME", "LATITUDE", "LONGITUDE", "tiyatro")
        
      }

      this.setState({items:this.state.items})

      console.log("tiyatro ok")
    }
    catch(e){
      console.log(e)
      if (this.error.tiyatro < maxHata){
        setTimeout(() => this.getTiyatro(),500)
        console.log("hata tiyatro")
        this.error.tiyatro++
      }
        
    }
    
  }

  async getParkYesil()
  {
    var distance = 50 / 60 * parseInt(this.time)

    var sql = 'SELECT "NAME","LONGITUDE","LATITUDE",'
    +'(111.1111*DEGREES(ACOS(LEAST(1.0, COS(RADIANS("LATITUDE")))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))) AS distance_km FROM "d588f256-2982-43d2-b372-c38978d7200b"'
    +'WHERE (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+')))))) < '+distance
    +'ORDER BY (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))))'

    try
    {
      var query = {
        sql:sql
      };
      var data = await $.ajax({
        url: 'http://data.ibb.gov.tr/api/3/action/datastore_search_sql',
        data: query,
        dataType: 'jsonp',
      });

      for (var i = 0; i < data.result.records.length; i++)
      {
        if (data.result.records[i].distance_km == null)
          continue;
        this.checkDistance(data.result.records[i], "Parklar ve Yeşil Alanlar", "NAME", "LATITUDE", "LONGITUDE", "parkyesil")
        
      }

      this.setState({items:this.state.items})

      console.log("parkyesil ok")
    }
    catch(e){
      console.log(e)
      if (this.error.parkyesil < maxHata){
        setTimeout(() => this.getParkYesil(),500)
        console.log("hata parkyesil")
        this.error.parkyesil++
      }
        
    }
    
  }

  async getHastane()
  {
    var distance = 50 / 60 * parseInt(this.time)

    var sql = 'SELECT "ADI","BOYLAM","ENLEM" FROM "f2154883-68e3-41dc-b2be-a6c2eb721c9e"'

    try
    {
      var query = {
        sql:sql
      };
      var data = await $.ajax({
        url: 'http://data.ibb.gov.tr/api/3/action/datastore_search_sql',
        data: query,
        dataType: 'jsonp',
      });

      for (var i = 0; i < data.result.records.length; i++)
      {
        var dst = helpers.distance(this.lat, this.lng, data.result.records[i].ENLEM, data.result.records[i].BOYLAM, "K") 
        if (dst < distance){
          data.result.records[i].distance_km = dst
          this.checkDistance(data.result.records[i], "Sağlık Kuruluşları", "ADI", "ENLEM", "BOYLAM", "hastane")
        }
      }

      this.setState({items:this.state.items})

      console.log("hastane ok")
    }
    catch(e){
      console.log(e)
      if (this.error.hastane < maxHata){
        setTimeout(() => this.getHastane(),500)
        console.log("hata hastane")
        this.error.hastane++
      }
        
    }
    
  }

  async getAkaryakit()
  {
    var distance = 50 / 60 * parseInt(this.time)

    var sql = 'SELECT "FUEL_DISTRIBUTION_COMPANY_DESC","LONGTITUDE","LATITUDE",'
    +'(111.1111*DEGREES(ACOS(LEAST(1.0, COS(RADIANS("LATITUDE")))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGTITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))) AS distance_km FROM "5625860c-d79a-446f-898e-2aa2b9099bc8"'
    +'WHERE (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGTITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+')))))) < '+distance
    +'ORDER BY (111.1111 * DEGREES(ACOS(LEAST(1.0,COS(RADIANS("LATITUDE"))'
    +'*COS(RADIANS('+this.lat+'))'
    +'*COS(RADIANS("LONGTITUDE") - RADIANS('+this.lng+'))'
    +'\+SIN(RADIANS("LATITUDE"))'
    +'*SIN(RADIANS('+this.lat+'))))))'

    try
    {
      var query = {
        sql:sql
      };
      var data = await $.ajax({
        url: 'http://data.ibb.gov.tr/api/3/action/datastore_search_sql',
        data: query,
        dataType: 'jsonp',
      });

      for (var i = 0; i < data.result.records.length; i++)
      {
        if (data.result.records[i].distance_km == null)
          continue;
        this.checkDistance(data.result.records[i], "Akaryakıt İstasyonları", "FUEL_DISTRIBUTION_COMPANY_DESC", "LATITUDE", "LONGTITUDE", "akaryakit")

      }

      this.setState({items:this.state.items})

      console.log("akaryakıt ok")
    }
    catch(e){
      console.log(e)
      if (this.error.akaryakit < maxHata){
        console.log("hata akaryakit")
        setTimeout(() => this.getAkaryakit(),500)
        this.error.akaryakit++
      }
        
    }
    
  }

  getIsBike()
  {
    var distance = 50 / 60 * parseInt(this.time)

    try
    {

      
      for (var i = 0; i < isbike.dataList.length; i++)
      {
        var dst = helpers.distance(this.lat, this.lng, isbike.dataList[i].lat, isbike.dataList[i].lon, "K")
        if (dst < distance){
          isbike.dataList[i].distance_km = dst
          this.checkDistance(isbike.dataList[i], "İsbike İstasyonları", "adi", "lat", "lon", "isbike")

        }
          
      }

      console.log("bruh")
      console.log(this.state.items)

      this.setState({items:this.state.items})

      console.log("isbike ok")
    }
    catch(e){
      console.log(e)
      if (this.error.isbike < maxHata){
        console.log("hata isbike")
        setTimeout(() => this.getIsBike(),500)
        this.error.isbike++
      }
        
    }
  }

  async checkDistance(item, title, name, lat, lng, key)
  {
    var speed = 50

    console.log(item.distance_km)
    console.log((Math.floor(parseFloat(item.distance_km) / 1000)))

    try
    {
      var time = item.distance_km  / speed 
      time  = Math.round(time * 60)

      console.log(time)
      console.log(this.time)

      if (time > this.time)
        return;

      if (typeof this.state.items[key] === "undefined"){
        this.state.items[key] = {
          items:[],
          name:title
        }

        this.items[key] = {
          items:[],
          name:title
        }
      }

      var distanceVisual = (Math.floor(parseFloat(item.distance_km))) + " KM"
      if ((parseFloat(item.distance_km) / 1000) < 1 && (parseFloat(item.distance_km)) !== 0)
        distanceVisual = (parseFloat(item.distance_km)).toString().substring(0,3) + " KM"
      

      this.items[key].items.push({
        name:item[name],
        lng:(""+item[lng]).trim(),
        lat:(""+item[lat]).trim(),
        distance:  distanceVisual,
        time:time + " Dakika"
      })
    }
    catch(e){

    }
  }

  /*async checkDistanceOld(item, title, name, lat, lng, key)
  {
    try
    {
      var data = await $.ajax({
        url: 'https://cbsproxy.ibb.gov.tr/?networkws&baslangic='+this.lng + "|" + this.lat+'&ara=&bitis=' + (""+item[lng]).trim() + "|" + (""+item[lat]).trim(),
        dataType: 'json'
      });

      var datas = data.string["#text"].split("@")
      var coords = datas[0]
      var distance = datas[1].split("<br>")[0].split("</b>")[1]
      distance = distance.substring(0, distance.length-1).trim()
      
      coords = coords.split(",")

      coords.splice(coords.length - 1, 1)

      for (var i = 0; i < coords.length; i++)
      {
        let x = {}
        coords[i] = coords[i].split(" ")
        x.lat = coords[i][1]
        x.lng = coords[i][0]
        coords[i] = x
      }

      var distances = []

      for (var i = 0; i < coords.length; i++)
      {
        if (i == 0)
          distances.push(helpers.distance(this.lat, this.lng, coords[i].lat, coords[i].lng, "M"))
        else
        distances.push(helpers.distance(coords[i-1].lat, coords[i-1].lng, coords[i].lat, coords[i].lng, "M"))
      }

      var time = 0

      for (var i = 0; i < distances.length; i++)
      {
        let speed = 20
        if (distances[i] <= 20)
          speed = 35
        else if (distances[i] <= 30)
          speed = 40
        else if (distances[i] <= 40)
          speed = 50
        else if (distances[i] <= 50)
          speed = 60
        else if (distances[i] <= 60)
          speed = 70
        else if (distances[i] <= 70)
          speed = 80
        else if (distances[i] <= 80)
          speed = 90
        else if (distances[i] <= 100)
          speed = 100
        else
          speed = 120

        time += (distances[i] / 1000) / speed
      }

      time  = Math.round(time * 60)

      if (time > this.time)
        return;

      if (typeof this.state.items[key] === "undefined")
        this.state.items[key] = {
          items:[],
          name:title
        }

      var distanceVisual = (Math.floor(parseFloat(distance) / 1000)) + " KM"
      if ((parseFloat(distance) / 1000) < 1 && (parseFloat(distance) / 1000) !== 0)
        distanceVisual = (parseFloat(distance) / 1000).toString().substring(0,3) + " KM"
      

      this.state.items[key].items.push({
        name:item[name],
        lng:(""+item[lng]).trim(),
        lat:(""+item[lat]).trim(),
        distance:  distanceVisual,
        time:time + " Dakika"
      })

      this.setState({items:this.state.items})

    }
    catch(e){
      console.log(e)
    }
  }*/

  closeMap()
  {
    window.scrollTo(0, 0)
    this.setState({mapTriggered:false})
    this.map.Marker.Remove()
    this.map.RouteAnalysis.Close()
  }

  triggerMap(action, lat, lng, name)
  {
    this.map.Marker.Remove()
    this.map.RouteAnalysis.Close()
    this.setState({mapTriggered:name})
    window.scrollTo(0, document.body.scrollHeight)
    if (action === "mark")
    {
      this.map.Marker.Add({
        lat: lat,
        lon: lng,
        effect: true,
        iconUrl: this.map.icons.Info,
        zoom: 18,
        gotoPosition: true,
        draggable: false,
        showPopover: true,
        content: '',
        title: name,
        anchorX: this.map.anchors.Left,
        anchorY: this.map.anchors.Top,
        opacity:1,
        toolbar:true
      }); 
    }else if (action === "drive")
    {
      this.map.RouteAnalysis.Drive({
        start:
        {
          lat: this.lat,
          lon: this.lng
        },
        finish:
        {
          lat: lat,
          lon: lng
        }
      });
    }
  }

  openLocation(key, clear = false)
  {

    return new Promise((resolve, reject) => {
			
      for (var i = 0; i < this.state.items.length; i++)
        this.state.items[i].items = []

      if (!clear)
        this.state.items[key].items = this.items[key].items

      this.setState({items: this.state.items}, () => resolve())
		})

  }

  render()
  {
    return (
      <>

        <Header>
          <Link to={"/"}>GUIDE ME</Link>
        </Header>
        
        <MapContainer>
            <MapLeft>

              <Accordion
                items = {this.state.items}
                open={this.openLocation}
                triggerMap={this.triggerMap}
              />

            </MapLeft>

            <Map>
                {this.state.mapTriggered && (
                  <MapLabel>
                    {this.state.mapTriggered}
                    <Icon onClick={() => this.closeMap()} className="cursor-pointer h-100" icon={faTimes} />
                  </MapLabel>
                )}
                
                <iframe id="map" src="https://sehirharitasi.ibb.gov.tr" style={{height:(this.state.mapTriggered ? "calc(100% - 71px)" : "100%"), width:"100%"}}></iframe>
            </Map>
        </MapContainer>

      </>
    )
  }

}

export default withRouter(MapPage)