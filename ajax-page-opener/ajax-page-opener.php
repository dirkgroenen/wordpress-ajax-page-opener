<?php
    /*
    Plugin Name: Ajax page opener
    Plugin URI: http://bitlabs.nl
    Version 1.0.2
    Author: Bitlabs - Dirk Groenen
    Description: Opens wordpress pages or posts using ajax
    */

  class WPAjaxPageOpener{

    public function __construct(){
        add_action( 'wp_ajax_getpage', array($this, 'getpage') );
        add_action( 'wp_ajax_nopriv_getpage', array($this, 'getpage') );

        add_action( 'wp_enqueue_scripts', array($this, 'ajaxfunctions') );
        add_action( 'wp_head', array($this, 'addglobalvars') );
    }

    public function getpage() {
        // Remove the site url from the slug 
        $path = $_POST['slug'];
        
        // Get the page by the path and return an array
        $returndata = get_page_by_path($path, "OBJECT", "page");
        
        // Search for a post if the page doesn't exist
        if($returndata == null){
            $returndata = get_page_by_path($path, "OBJECT", "post");
        }
        echo json_encode($returndata);
        
        die(); // this is required to return a proper result
    }

    public function ajaxfunctions() {
        wp_enqueue_script( 'ajaxpageopener-functions',  plugins_url( '/js/functions.js' , __FILE__ ), array( 'jquery' ));
    }

    public function addglobalvars(){
        echo '<script type="text/javascript">
                var ajaxurl = "'. admin_url('admin-ajax.php') .'";
                var templatehome = "'. get_template_directory_uri() .'";
                var siteurl = "'. site_url() .'";
            </script>';
    }
    

  } 
  
  $wpajaxopener = new WPAjaxPageOpener();
?>
