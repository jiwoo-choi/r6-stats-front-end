import React from 'react';
import '../../App.css'
import './search.css'

import { BasicErrorFormat, APIObservable, API } from '../../util/API'
import R6Spinner from '../../R6Components/R6Spinner'
import {PVPAPI, GENERALAPI, OPERATORAPI, SEASONAPI, RANKBYREGION, getErrorMessage} from '../../util/type'
import Profile from './Profile';
import SearchOverviewTab from './Overview';
import SearchSeasonsTab from './Seasons';
import SearchOperators from './Operators';

import { Menu, Empty } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { forkJoin, of, EmptyError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface State {
    currentRankData : RANKBYREGION[],
    allRankData: SEASONAPI[],
    generalData : GENERALAPI,
    operators: OPERATORAPI[],
    casualPvpData: PVPAPI,
    rankPvpData: PVPAPI,
    loading: boolean,
    currentTab: number,
    current:string,
    success:boolean,
}

interface Props extends RouteComponentProps {
}

/**
 * TO-DO : loading View.
 * TO-DO : if it is not filled => show that? => loading? how? 
 */

class Search extends React.Component<Props, State> {

    private username?:string | null;
    private platform?:string | null;
    private unlisten?:any;

    constructor(props: Props){
        super(props);
        this.state = {
            currentRankData: [] as RANKBYREGION[],
			generalData: {} as GENERALAPI,
			allRankData: [] as SEASONAPI[],
            operators: [] as OPERATORAPI[],
            casualPvpData: {} as PVPAPI,
            rankPvpData: {} as PVPAPI,
            loading:true,
            currentTab:1,
            current: 'overview',
            success:false
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e:any) {
        this.setState({
            current: e.key,
          });
    }

    tabContentsHandler(key: string): React.ReactNode {
        switch(key){
            case 'overview':
                return(
                    <SearchOverviewTab 
                        generalData={this.state.generalData}
                        allRankStat={this.state.allRankData}
                        casualPvpData={this.state.casualPvpData}
                        rankPvpData={this.state.rankPvpData}
                    />);
            case 'seasons':
                return(<SearchSeasonsTab seasons={this.state.allRankData}></SearchSeasonsTab>);
            case 'operators':
                return(<SearchOperators></SearchOperators>);
        } 

    }
    

    updateFromAPI(){

        const params = new URLSearchParams(this.props.history.location.search);
        if (this.props.history.location.pathname !== "/search/query") {
            return;
        }

        this.username = params.get('username')
        this.platform = params.get('platform')


        this.setState( {loading: true})

        if (this.username && this.platform) {

            forkJoin(
                APIObservable<PVPAPI>(`rankpvp/${this.platform}/${this.username}`),
                APIObservable<PVPAPI>(`casualpvp/${this.platform}/${this.username}`),
                APIObservable<RANKBYREGION[]>(`rank/${this.platform}/${this.username}`),
                APIObservable<GENERALAPI>(`generalpvp/${this.platform}/${this.username}`),
                APIObservable<SEASONAPI[]>(`rank/${this.platform}/${this.username}/all`),
            ).pipe(
                catchError( err => {
                    return of(err as BasicErrorFormat)
                    
                }),
            ).subscribe(
                res=> { 
                    if (Array.isArray(res)){
                        this.setState({
                            rankPvpData : res[0],
                            casualPvpData: res[1],
                            currentRankData : res[2],
                            generalData : res[3],
                            allRankData : res[4],
                            success:true
                        })
                    } else {
                        alert(getErrorMessage(res.status));
                        this.setState({success:false})
                    }
                }, 
                ()=> {},
                () =>{
                    this.setState( {loading: false})
                }
                )       

            } else {
                alert(getErrorMessage(400));
                this.setState( {loading: false, success:false})
            }
    }
    
    async componentDidMount(){

        this.updateFromAPI()

        this.unlisten = this.props.history.listen( (location, action) => {
            this.updateFromAPI()
        })
        

        // 병렬코드. 
        /** 기존코드 : 소스비교를 위해 나둡니다. */
        // 초반 성능 향상을 위해 따로따로 요청하는것으로 합니다.
        // const operatorAPIs = await API<OPERATORAPI[]>("operator/uplay/piliot/");
        // const generalAPIs = await API<GENERALAPI>("generalpvp/uplay/piliot");
        // const [rankPvpAPIs, rankpvpError] = await API<PVPAPI>("rankpvp/uplay/piliot");
        // const [casualPvpAPIs, casuapvpError] = await API<PVPAPI>("casualpvp/uplay/piliot");
        // const [rankAPIs, rankapiError]= await API<RANKBYREGION[]>("rank/uplay/piliot");
        // const [generalAPIs, generalapiError] = await API<GENERALAPI>("generalpvp/uplay/piliot");
        // const [allRankAPIs, allrankapiError] = await API<SEASONAPI[]>("rank/uplay/piliot/all");
        // if (rankpvpError || casuapvpError || rankapiError || generalapiError || allrankapiError) {
        //     alert("Error : 연결에 에러가 있습니다")
        //     this.props.history.goBack();
        // } else {
        //     this.setState({generalData: generalAPIs!});
        //     this.setState({currentRankData: rankAPIs!});
        //     this.setState({rankPvpData: rankPvpAPIs!});
        //     this.setState({casualPvpData: casualPvpAPIs!});
        //     this.setState({allRankData : allRankAPIs!})
        //     this.setState({loading: false});
        // }
    }

    componentWillUnmount(){

        if(this.unlisten) {
            this.unlisten();
        }
    }

    render(){
        
        if (this.state.loading) {
            return <R6Spinner presentationStyle="full"></R6Spinner>
        } else if (!this.state.loading && !this.state.success) {
            return (
                <Empty
                    imageStyle={{
                    height: 500,
                    }}
                    description={
                    <span>
                        {getErrorMessage(400)}
                    </span>
                    }
                >
              </Empty>
            
            )
        } else {
            const tabContent = this.tabContentsHandler(this.state.current);
            return(
                <>
                <div className="search-page-container">
                    <div className="menu">
                        <Profile username={this.username!} currentRankData={this.state.currentRankData}></Profile>
                        <Menu mode="horizontal" selectedKeys={[this.state.current]} onClick={this.handleClick}>
                            <Menu.Item key="overview">
                            Overview
                            </Menu.Item>
                            <Menu.Item key="seasons">
                            Seasons
                            </Menu.Item>
                            <Menu.Item key="operators">
                            Operators
                            </Menu.Item>
                        </Menu>
                    </div>
                    {tabContent}
                </div>
                </>
            )
		}
    }
}


export default withRouter(Search);