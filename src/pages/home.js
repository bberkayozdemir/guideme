import React from "react"
import { Header, Card, Table, Button, Modal, Input, Label, View, Icon } from "../components/index.js"
import { color } from "../components/theme"
import { Container, Col, Row } from 'react-bootstrap'
import ReactModal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faTimes, faMapMarkerAlt, faCircleNotch } from '@fortawesome/free-solid-svg-icons'

import { withRouter, Link } from "react-router-dom";

class Home extends React.Component{

  constructor(props) {
    super(props)
    this.props = props
    this.state = {
      addressModal:false,
      addressModalChoice:false,
      addressModalMapLoaded:false,
      addresses:[],
      manualAddressError:"",
      geoLocationError:"",
      selectModal:false,
      customTime:false,
    }

    this.manualAddress = {
      lat:"",
      lng:""
    }

    this.aMap = null
    this.adding = false
    this.selectedAddress = null
    this.selectedTime = "15"
    this.customTime = ""
  }

  componentDidMount()
  {
    this.loadAddresses()
  }

  loadAddresses()
  {
    var addresses = []

    if (typeof localStorage.addresses !== "undefined")
    {
      let x = localStorage.addresses
      try{
        x = JSON.parse(x)
      }catch(err){}

      addresses = x
    }

    this.setState({addresses})
  }

  initAddAddressMap()
  {
    if (this.aMap != null)
      delete this.aMap

    this.setState({addressModalChoice:"map"}, () => {
    this.aMap = new window.SehirHaritasiAPI({mapFrame:"addAddressMap",apiKey:"3f37d6cb20724201956ce1d04c1939a4"}, () => {

        this.setState({addressModalMapLoaded:true})
        console.log(this.aMap)
        console.log("OKKK")
        this.aMap.Map.Toolbar({
          network: false,
          panorama: false,
          menu: false,
          layers: false,
          search: true,
          mapSwitch: false,
          traffic: false,
          label:false,
          clear:false,
          measure:false,
          print:false,
        });  
      })
    })
    
  }

  approveAddressModalMapLocation()
  {
    if (this.adding)
      return
    this.adding = true
    this.aMap.Map.GetCenter((lat, lng) => {
      this.adding = false
      this.addAddress(lat,lng, true)
    })
  }

  addAddress(lat, lng, isMap)
  {
    var addresses = this.state.addresses

    if (isMap)
      for (var i = 0; i < this.state.addresses.length; i++){
        if (this.state.addresses[i].lat === lat && this.state.addresses[i].lng === lng)
        {
          this.closeAddressModal()
          return
        }
      }

    addresses.push({lat:lat,lng:lng})
    localStorage.setItem('addresses', JSON.stringify(addresses))

    this.closeAddressModal()
    this.loadAddresses()
  }

  setAddressModalChoice(choice)
  {
    this.setState({addressModalMapLoaded:false, addressModalChoice:choice, manualAddressError:"", geoLocationError:""}, () => {
      if (choice === "map")
        this.initAddAddressMap()
      else if (choice === "manual")
        this.manualAddress = {
          lat:"",
          lng:""
        }
      else if (choice === "auto")
        this.getGeolocation()
    })
  }

  closeAddressModal()
  {
    this.setState({addressModal: false, addressModalMapLoaded:false, addressModalChoice:false, manualAddressError:"", geoLocationError: ""})
    this.manualAddress = {
      lat:"",
      lng:""
    }
  }

  saveManualAddress()
  {
    if (this.manualAddress.lat.trim() === "" || this.manualAddress.lng.trim() === "")
    {
      this.setState({manualAddressError:"Lütfen alanları doldurunuz"})
      return
    }

    this.addAddress(this.manualAddress.lat.trim(), this.manualAddress.lng.trim())
  }

  getGeolocation()
  {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((pos) => {
        this.addAddress(pos.coords.latitude, pos.coords.longitude)
      });
    else
      this.setState({geoLocationError:"Başarısız!"})
  }

  deleteAddress(i)
  {
    this.state.addresses.splice(i,1)
    localStorage.setItem('addresses', JSON.stringify(this.state.addresses))
    this.setState({addresses:this.state.addresses})
  }

  chooseAddress(i)
  {
    this.selectedAddress = this.state.addresses[i]
    this.setState({selectModal:true})
  }

  closeSelectModal()
  {
    this.setState({selectModal:false, customTime:false})
    this.selectedAddress = null
    this.customTime = ""
    this.selectedTime = "15"
  }

  setTime(val)
  {
    if (val === "custom")
    {
        this.selectedTime = null
        this.setState({customTime:true})
    }
    else{
        this.setState({customTime:false})
        console.log(val)
        this.selectedTime = val
    }
  }

  approveTime()
  {
    if (this.state.customTime)
    {
        if (this.customTime.trim() === "")
            return this.setState({timeError:"Zaman giriniz!"})

        if (isNaN(this.customTime))
            return this.setState({timeError:"Sadece sayı giriniz!"})

        this.proceedToMap(this.customTime.trim())
    }
    else{
        if (this.state.selectedTime === "")
            return this.setState({timeError:"Zaman seçiniz"})
        this.proceedToMap(this.selectedTime)
    }
  }

  proceedToMap(time)
  {
    this.props.history.push("/" + this.selectedAddress.lat + "/" + this.selectedAddress.lng + "/" + time)
  }

  render()
  {
    ReactModal.setAppElement('#root')

    return (
      <>
        <Header>
          <Link to={"/"}>GUIDE ME</Link>
        </Header>
        <Container>
          <Card>
            <Card.Header>
              <Card.Title>
                Adreslerim
              </Card.Title>
              <Button primary onClick={() => this.setState({addressModal:true})}>
                Ekle
              </Button>
            </Card.Header>
            <Card.Body>
              <Table>
                <Table.Head>
                  <Table.TR>
                    <Table.TH>
                      Konum
                    </Table.TH>
                    <Table.TH align="right">
                      İşlem
                    </Table.TH>
                  </Table.TR>
                </Table.Head>
                <Table.Body>

                  {this.state.addresses.map((a,i) => (
                    <Table.TR key={i}>
                      <Table.TD>
                        {a.lat}, {a.lng}
                      </Table.TD>
                      <Table.TD align="right">
                        <Button small className="me-1" onClick={() => this.chooseAddress(i)}>
                          Seç
                        </Button>
                        <Button small onClick={() => this.deleteAddress(i)}>
                          Sil
                        </Button>
                      </Table.TD>
                    </Table.TR>
                  ))}
                  
                </Table.Body>
              </Table>
            </Card.Body>
          </Card>
        </Container>

        <ReactModal
            isOpen={this.state.selectModal}
            onRequestClose={() => this.closeSelectModal()}
            contentLabel="Seç"
            className={"g-modal"}
            overlayClassName="modal-overlay"
            closeTimeoutMS={250}
          >
            <Modal.Header>
              <Modal.Title>
                Zaman Seçimi
              </Modal.Title>
              <Modal.Times onClick={() => {this.closeSelectModal()}}>
                <FontAwesomeIcon icon={faTimes} />
              </Modal.Times>
            </Modal.Header>

            <Modal.Body>
                <View flex jc-space-between fullwidth>
                    <Label>
                        <input defaultChecked={true} name="time" value="15" type="radio" onChange={(e) => this.setTime(e.target.value)}/>
                        <span> 15 Dakika</span>
                    </Label>

                    <Label>
                        <input name="time" value="30" type="radio" onChange={(e) => this.setTime(e.target.value)}/>
                        <span> 30 Dakika</span>
                    </Label>

                    <Label>
                        <input name="time" value="60" type="radio" onChange={(e) => this.setTime(e.target.value)}/>
                        <span> 1 Saat</span>
                    </Label>

                    <Label>
                        <input name="time" value="custom" type="radio" onChange={(e) => this.setTime(e.target.value)}/>
                        <span> Diğer</span>
                    </Label>
                </View>

                {this.state.customTime && (
                    <View fullwidth className="mt-3">
                        <Label block for="customTime">Zaman (Dakika)</Label>
                        <Input id="customTime" type="text" onChange={(e) => this.customTime = e.target.value}/>
                    </View>
                )}

                <Button primary small className="mt-3" onClick={() => this.approveTime()}>Gönder</Button>
                <View fullWidth color="red" className="mt-1">{this.state.timeError}</View>

            </Modal.Body>
        </ReactModal>

        <ReactModal
            isOpen={this.state.addressModal}
            onRequestClose={() => this.closeAddressModal()}
            contentLabel="Adres Ekle"
            className={"g-modal" + (this.state.addressModalChoice === "map" ? " g-modal-large" : "")}
            overlayClassName="modal-overlay"
            closeTimeoutMS={250}
          >
            <Modal.Header>
              <Modal.Title>
                {this.state.addressModalChoice !== false && (
                  <FontAwesomeIcon onClick={() => this.setAddressModalChoice(false)} className="me-2 cursor-pointer" icon={faChevronLeft} />
                )}
                Adres Ekle
              </Modal.Title>
              <Modal.Times onClick={() => {this.closeAddressModal()}}>
                <FontAwesomeIcon icon={faTimes} />
              </Modal.Times>
            </Modal.Header>

            <Modal.Body>
              {!this.state.addressModalChoice && (
                <>
                  <Button block primary className="mb-2" onClick={() => this.setAddressModalChoice("auto")}>Mevcut Konumu Kullan</Button>
                  <Button block primary className="mb-2" onClick={() => this.setAddressModalChoice("map")}>Haritadan Seç</Button>
                  <Button block primary onClick={() => this.setAddressModalChoice("manual")}>Manuel Ekle</Button>
                </>
              )}

              {this.state.addressModalChoice === "auto" && (
                <>
                  <div className="text-center">
                    Lütfen konum isteğini onaylayınız
                    <View fullWidth color="red" className="mt-1">{this.state.geoLocationError}</View>
                  </div>
                </>
              )}

              {this.state.addressModalChoice === "manual" && (
                <>
                  <Row>
                    <Col md="6">
                      <Label for="aam-lat">Latitude</Label>
                      <Input id="aam-lat" type="text" onChange={(e) => this.manualAddress.lat = e.target.value}/>
                    </Col>
                    <Col md="6">
                      <Label for="aam-lng">Longitude</Label>
                      <Input id="aam-lng" type="text" onChange={(e) => this.manualAddress.lng = e.target.value}/>
                    </Col>
                  </Row>
                  <Button primary className="mt-3" onClick={() => this.saveManualAddress()}>Kaydet</Button>
                  <View fullWidth color="red" className="mt-1">{this.state.manualAddressError}</View>
                </>
              )}

              {this.state.addressModalChoice === "map" && (
                <View position="relative">
                  <View fullWidth fullHeight position="absolute" flex jc-center ai-center dummy top="-20" >
                    {this.state.addressModalMapLoaded && (
                      <Icon color={color.primary} size="28" icon={faMapMarkerAlt}/>
                    )}

                    {!this.state.addressModalMapLoaded && (
                      <Icon color={color.primary} size="28" icon={faCircleNotch} spin={true}/>
                    )}
                    
                  </View>
                  <iframe title="map" id="addAddressMap" src="http://sehirharitasi.ibb.gov.tr" style={{height:500, width:"100%"}}></iframe>
                  {this.state.addressModalMapLoaded && (
                    <Button primary block onClick={() => this.approveAddressModalMapLocation()}>Seçili Konumu Onayla</Button>
                  )}
                </View>
              )}
            </Modal.Body>
            
        </ReactModal>

      </>
    )
  }

}

export default withRouter(Home)